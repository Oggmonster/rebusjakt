using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web;

namespace Rebusjakt.Services
{
    public class EmailService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            string text = message.Body;
            string html = message.Body;
            string senderAccount = ConfigurationManager.AppSettings["mailAccount"];
            MailMessage msg = new MailMessage();
            msg.From = new MailAddress(senderAccount);
            msg.To.Add(new MailAddress(message.Destination));
            msg.Subject = message.Subject;
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));
            msg.SubjectEncoding = System.Text.Encoding.UTF8;
            msg.BodyEncoding = System.Text.Encoding.UTF8;            

            //you may need to enable less secure apps in gmail for this to work
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587));
            smtpClient.Credentials = new NetworkCredential(
                      senderAccount,
                      ConfigurationManager.AppSettings["mailPassword"]
                      );
            smtpClient.EnableSsl = true;
            smtpClient.SendCompleted += (s, e) =>
            {
                smtpClient.Dispose();
                msg.Dispose();
            };
            return smtpClient.SendMailAsync(msg);
        }        
    }
}