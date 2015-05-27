﻿using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rebusjakt.DAL
{
    public class UnitOfWork : IDisposable
    {
        private RiddleContext context = new RiddleContext();
        private GenericRepository<Hunt> huntRepository;
        private GenericRepository<Riddle> riddleRepository;
        private GenericRepository<Question> questionRepository;

        public UnitOfWork()
        {
            //logs sql queries generated by entity framework and show execution time
            context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public GenericRepository<Hunt> HuntRepository
        {
            get
            {
                if (this.huntRepository == null)
                {
                    this.huntRepository = new GenericRepository<Hunt>(context);
                }
                return huntRepository;
            }
        }

        public GenericRepository<Riddle> RiddleRepository
        {
            get
            {
                if (this.riddleRepository == null)
                {
                    this.riddleRepository = new GenericRepository<Riddle>(context);
                }
                return riddleRepository;
            }
        }
        
        public GenericRepository<Question> QuestionRepository
        {
            get
            {
                if (this.questionRepository == null)
                {
                    this.questionRepository = new GenericRepository<Question>(context);
                }
                return questionRepository;
            }
        }

        public void Save()
        {
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
