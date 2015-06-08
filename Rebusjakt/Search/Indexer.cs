using Nest;
using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.Search
{
    public class Indexer
    {
        private ElasticClient client;
        private string indexName = "rebusjakt";
        public Indexer()
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(
                node,
                defaultIndex: indexName
            );

            client = new ElasticClient(settings);
            client.CreateIndex(indexName, s => s
                 .AddMapping<Hunt>(f => f
                 .MapFromAttributes() // all default types will be mapped as primitives
                 .Properties(p => p
                   .GeoPoint(g => g.Name(n => n.Location).IndexLatLon())
                 )
               )
             );
        }

        public void DeleteIndex()
        {
            client.DeleteIndex(indexName);
        }

        public void DeleteHunt(int id)
        {
            client.Delete<Hunt>(id);
        }

        public void UpdateHunt(Hunt hunt)
        {
            var response = client.Update<Hunt, object>(h => h
                .IdFrom(hunt)
                .Doc(hunt)
                .DocAsUpsert()
            );
            var isOk = response.IsValid;
        }
    }
}