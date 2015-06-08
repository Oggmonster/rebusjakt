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

        public ISearchResponse<Hunt> Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                query = " ";
            }
            query = string.Join("* ", query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            query += "*";
            var result = client.Search<Hunt>(s => s
                .From(0)
                .Size(50)
                .Query(q =>
                    q.QueryString(h => h.Query(query).OnFields(f => f.Name, f => f.Theme, f => f.Description).AnalyzeWildcard(true))
                )
            );

            return result;
        }

        public ISearchResponse<Hunt> SearchByLocation(double lat, double lng)
        {
            var result = client.Search<Hunt>(s => s
                .Index(indexName)
                .Filter(
                    filterDescriptor =>
                        filterDescriptor.GeoDistance(post1 => post1.Location, geoDistanceFilterDescriptor => geoDistanceFilterDescriptor
                            .Distance(10, GeoUnit.Kilometers)
                            .Location(lat, lng)
                            .Optimize(GeoOptimizeBBox.Indexed)))
                .SortGeoDistance(sort => sort
					.OnField(e => e.Location)
					.Ascending()
					.PinTo(lat, lng)
					.Unit(GeoUnit.Kilometers)
					.Mode(SortMode.Max)
					.DistanceType(GeoDistance.Arc)
				));
            
              return result;
        }

        public ISearchResponse<Hunt> SearchByQueryAndLocation(string query, double lat, double lng)
        {
            if (string.IsNullOrEmpty(query))
            {
                query = " ";
            }
            query = string.Join("* ", query.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            query += "*";

            var result = client.Search<Hunt>(s => s
                .Index(indexName)
                .From(0)
                .Size(50)
                .Query(q =>
                    q.QueryString(h => h.Query(query).OnFields(f => f.Name, f => f.Theme, f => f.Description).AnalyzeWildcard(true))
                )
                .Filter(
                    filterDescriptor =>
                        filterDescriptor.GeoDistance(post1 => post1.Location, geoDistanceFilterDescriptor => geoDistanceFilterDescriptor
                            .Distance(10, GeoUnit.Kilometers)
                            .Location(lat, lng)
                            .Optimize(GeoOptimizeBBox.Indexed)))
                .SortGeoDistance(sort => sort
                    .OnField(e => e.Location)
                    .Ascending()
                    .PinTo(lat, lng)
                    .Unit(GeoUnit.Kilometers)
                    .Mode(SortMode.Max)
                    .DistanceType(GeoDistance.Arc)
                ));

            return result;
        }
    }
}