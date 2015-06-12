using Rebusjakt.Models;
using Rebusjakt.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class ChallengeController : Controller
    {
        private Indexer indexer = new Indexer();
        private Searcher searcher = new Searcher();

        public ActionResult Index(string id){
            var challengeResult = searcher.FindChallengeById(id);
            if(challengeResult.Total > 0){
                var challenge = challengeResult.Hits.First().Source;
                return View(challenge);
            }else
            {
                return View("NotFound");
            }
        }

        public JsonResult CreateChallenge(Challenge challenge)
        {
            challenge.Id = Guid.NewGuid().ToString();
            indexer.UpdateChallenge(challenge);
            return Json("ok");
        }

        public JsonResult AcceptChallenge(string id)
        {
            var challengeResult = searcher.FindChallengeById(id);
            if(challengeResult.Total > 0){
                var challenge = challengeResult.Hits.First().Source;
                challenge.IsAccepted = true;
                indexer.UpdateChallenge(challenge);                
            }
            return Json("ok");
        }

    }
}