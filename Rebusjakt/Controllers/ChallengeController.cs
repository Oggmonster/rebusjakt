using Rebusjakt.DAL;
using Rebusjakt.Models;
using Rebusjakt.Search;
using Rebusjakt.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Rebusjakt.ViewModels;
using Rebusjakt.Extensions;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class ChallengeController : Controller
    {
        private Indexer indexer = new Indexer();
        private Searcher searcher = new Searcher();
        private UnitOfWork unitOfWork = new UnitOfWork();

        
        public ActionResult Index(string id){
            if (string.IsNullOrEmpty(id))
            {
                return View("NotFound");
            }

            var challengeResult = searcher.FindChallengeById(id);
            if( challengeResult.Total > 0){
                var challenge = challengeResult.Hits.First().Source;
                return View(challenge);
            }else
            {
                return View("NotFound");
            }
        }

        public ActionResult MyChallenges()
        {
            var user = unitOfWork.UserRepository.GetByID(User.Identity.GetUserId());
            var created = searcher.FindChallengeByChallengerUserId(user.Id);
            var challenged = searcher.FindChallengeByChallengedUserEmail(user.Email);
            
            var viewModel = new MyChallengesViewModel
            {
                Created = created.Hits.Select(h => h.Source).ToList(),
                Challenged = challenged.Hits.Select(h => h.Source).ToList()
            };
            return View(viewModel);
        }

        
        public JsonResult GetChallengeResultByGroupId(string id)
        {
            var challengeResult = searcher.FindChallengeByGroupId(id);
            if (challengeResult.Total > 0)
            {
                var challenges = challengeResult.Hits.Select(s => s.Source).Where(c => c.UserScore != null).OrderBy(u => u.UserScore.Score).ToList();
                return Json(challenges);
            }
            else
            {
                return Json("");
            }
        }

        private IdentityMessage CreateMessage(Challenge challenge){
            var messageBody = challenge.Message;
            var huntUrl = string.Format("<a href='http://rebusjakt.se/challenge/index/{0}'>Anta utmaningen</a>", challenge.Id);
            var huntDescription = string.Format("<br><br>Rebusjakt: {0} <br> Tema: {1} <br> Plats: {2} <br> Starttid: kl {3} <br> Beskrivning: {4} <br> Utmanare: {5} <br><br><strong>{6}</strong> (du kommer att bli ombedd att logga in / skapa användare)<br><br>Obs! svara inte på detta mail", 
                challenge.HuntName, challenge.HuntTheme, challenge.HuntLocation, challenge.StartDate.ToString("HH:mm dd-MMM-yyyy"), challenge.HuntDescription, challenge.ChallengerUserName, huntUrl);
            messageBody += huntDescription;
            var message = new IdentityMessage
            {
                Body = messageBody,
                Destination = challenge.ChallengedEmail,
                Subject = string.Format("Du har blivit utmanad till en rebusjakt av {0}", challenge.ChallengerUserName)
            };
            return message;
        }

        private List<string> ValidateEmails(List<string> emails, string creatorEmail, int huntId)
        {
            var errors = new List<string>();
            foreach (var item in emails)
            {
                var email = item.Trim();
                if (email == creatorEmail)
                {
                    errors.Add("Du kan inte utmana dig själv eftersom du automatiskt läggs till som deltagare (förutsatt att det inte är du själv som skapat jakten).");
                }
                if (!email.IsEmail())
                {
                    errors.Add(email + " är inte en giltig e-postadress.");
                }
                var existingUser = unitOfWork.UserRepository.Get().FirstOrDefault(u => u.Email == email);
                if (existingUser != null)
                {
                    var userScore = unitOfWork.UserScoreRepository.Get().FirstOrDefault(s => s.UserId == existingUser.Id && s.HuntId == huntId);
                    if (userScore != null)
                    {
                        errors.Add(email + " har redan utfört jakten.");
                    }
                }
            }
            return errors;
        }

        public async Task<JsonResult> CreateChallenge(ChallengeCreator challengeCreator)
        {
            var challenger = unitOfWork.UserRepository.GetByID(challengeCreator.UserId);
            var hunt = unitOfWork.HuntRepository.GetByID(challengeCreator.HuntId);
            var errors = ValidateEmails(challengeCreator.Emails, challenger.Email, hunt.Id);
            
            if (challengeCreator.StartDate == DateTime.MinValue)
            {
                errors.Add("Du måste ange en starttid");
            }
            if (errors.Count > 0)
            {
                return Json(new {errors = errors} );
            }
           
            var groupId = Guid.NewGuid().ToString();
            var createdDate = DateTime.Now;
            var messages = new List<IdentityMessage>();

            foreach (var email in challengeCreator.Emails)
            {
                var challenge = new Challenge
                {
                    Id = Guid.NewGuid().ToString(),
                    GroupId = groupId,
                    ChallengerUserName = challenger.UserName,
                    ChallengerUserId = challengeCreator.UserId,
                    Message = challengeCreator.Message,
                    HuntId = hunt.Id,
                    HuntName = hunt.Name,
                    HuntSlug = hunt.Slug,
                    HuntTheme = hunt.Theme,
                    HuntLocation = hunt.StartLocation,
                    HuntDescription = hunt.Description,
                    ChallengedEmail = email.Trim(),
                    StartDate = challengeCreator.StartDate,
                    CreatedDate = createdDate
                };
                
                indexer.UpsertChallenge(challenge);
                messages.Add(CreateMessage(challenge));                
            }

            if (hunt.UserId != challenger.Id)
            {
                //create challenge for challenger as well but without sending invite
                var creatorChallenge = new Challenge
                {
                    Id = Guid.NewGuid().ToString(),
                    GroupId = groupId,
                    ChallengerUserName = challenger.UserName,
                    ChallengerUserId = challengeCreator.UserId,
                    Message = challengeCreator.Message,
                    HuntId = hunt.Id,
                    HuntName = hunt.Name,
                    HuntSlug = hunt.Slug,
                    HuntTheme = hunt.Theme,
                    HuntLocation = hunt.StartLocation,
                    HuntDescription = hunt.Description,
                    ChallengedEmail = challenger.Email,
                    ChallengedUserId = challenger.Id,
                    ChallengedUserName = challenger.UserName,
                    StartDate = challengeCreator.StartDate,
                    CreatedDate = createdDate
                };
                indexer.UpsertChallenge(creatorChallenge);
            }

            //send emails
            var emailService = new EmailService();
            var tasks = messages.Select(m => emailService.SendAsync(m));
            await Task.WhenAll(tasks);
            return Json(groupId);
        }

        [Authorize]
        public JsonResult AcceptChallenge(string id)
        {
            var challengeResult = searcher.FindChallengeById(id);
            if(challengeResult.Total > 0){
                var challenge = challengeResult.Hits.First().Source;
                challenge.ChallengedUserId = User.Identity.GetUserId();
                challenge.ChallengedUserName = User.Identity.GetUserName();
                challenge.IsAccepted = true;
                indexer.UpsertChallenge(challenge);                
            }
            return Json("ok");
        }

        public JsonResult RejectChallenge(string id)
        {
            indexer.DeleteChallenge(id);
            return Json("ok");
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }

    }
}