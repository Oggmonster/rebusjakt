using Amazon.S3;
using Amazon.S3.Model;
using ImageResizer;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class ImageController : Controller
    {
        private string accessKey = ConfigurationManager.AppSettings["awsAccess"];
        private string secretKey = ConfigurationManager.AppSettings["awsSecret"];
        private string bucketName = "rebusjakt";

        public JsonResult Upload(HttpPostedFileBase file)
        {
            string imageSrc = "";
            if (file != null)
            {
                var extension = Path.GetExtension(file.FileName);
                var keyName = Guid.NewGuid().ToString().Replace("-", "") + DateTime.Now.ToString("ddMMyyyyHHmmss") + extension;
                using(var destinationStream = new MemoryStream())
	            {
                    ImageBuilder.Current.Build(file.InputStream, destinationStream, new ResizeSettings("maxwidth=400&maxheight=400&scale=both"), true);
                    using (var client = Amazon.AWSClientFactory.CreateAmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.EUWest1))
                    {
                        PutObjectRequest request = new PutObjectRequest
                        {
                            BucketName = bucketName,
                            Key = "images/" + keyName,
                            CannedACL = S3CannedACL.PublicRead,
                            InputStream = destinationStream
                        };
                        request.Metadata.Add("Cache-Control", "max-age=31536000");
                        var response = client.PutObject(request);
                    }
	            }
                imageSrc = "//d2igriiyls8v77.cloudfront.net/images/" + keyName;
            }
            return Json(imageSrc);
        }

        public void RemoveImage(string src)
        {
            var keyName = src.Replace("//d2igriiyls8v77.cloudfront.net/", "");
            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = keyName
            };

            using (var client = Amazon.AWSClientFactory.CreateAmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.EUWest1))
            {
                client.DeleteObject(deleteObjectRequest);
            }
        }
    }
}