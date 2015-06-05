using Nest;
using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.Search
{
    public class Searcher
    {
        private ElasticClient client;
        private string indexName = "rebusjakt";

        public Searcher()
        {
            var node = new Uri("http://localhost:9200");

            
            var settings = new ConnectionSettings(
                node,
                defaultIndex: indexName
            );

            client = new ElasticClient(settings);
        }

        public ISearchResponse<Hunt> Search(string searchTerm)
        {
            searchTerm = string.Join("* ", searchTerm.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            searchTerm += "*";
            var result = client.Search<Hunt>(s => s
                .From(0)
                .Size(50)
                .Query(q =>
                    q.QueryString(h => h.Query(searchTerm).OnFields(f => f.Name, f => f.Theme, f => f.Description).AnalyzeWildcard(true))
                )
            );
            //q.Fuzzy(fz => fz.OnField("name").Value(searchTerm)).

            return result;
        }

        public ISearchResponse<Hunt> SearchByLocation(double lat, double lng)
        {
            var result = client.Search<Hunt>(s => s
                .Index(indexName)
                .Filter(
                    filterDescriptor =>
                        filterDescriptor.GeoDistance(post1 => post1.Location, geoDistanceFilterDescriptor => geoDistanceFilterDescriptor
                            .Distance(500, GeoUnit.Kilometers)
                            .Location(lat, lng)
                            .Optimize(GeoOptimizeBBox.Indexed)))
                );
              return result;
        }
    }
}