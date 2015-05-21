using AutoMapper;
using Rebusjakt.DAL;
using Rebusjakt.Models;
using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class GameController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ActionResult Index(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            Mapper.CreateMap<Riddle, RiddleViewModel>();
            Mapper.CreateMap<Question, QuestionViewModel>();
            var viewModel = new HuntViewModel
            {
                HuntId = hunt.Id,
                HuntName = hunt.Name,
                Riddles = Mapper.Map<IEnumerable<Riddle>, IEnumerable<RiddleViewModel>>(hunt.Riddles).ToList()
            };
            return View(viewModel);
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}