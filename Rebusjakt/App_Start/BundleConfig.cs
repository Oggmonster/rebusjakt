using System.Web;
using System.Web.Optimization;
using System.Web.Optimization.React;

namespace Rebusjakt
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/css/style").Include(
                "~/sass/base.css",
                "~/css/own-style.css"));

            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                        "~/js/base.min.js",
                        "~/js/toastit.js"));
           
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/js/jquery.validate*"));


            bundles.Add(new JsxBundle("~/bundles/riddleeditor").Include(
                    "~/ReactComponents/GeocodeMap.jsx",
                    "~/ReactComponents/GoogleMap.jsx",
                    "~/ReactComponents/EmojiPicker.jsx",
                    "~/ReactComponents/ImageUploader.jsx",
                    "~/ReactComponents/RiddleCreator.jsx",
                    "~/ReactComponents/QuestionCreator.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/hunteditor").Include(
                    "~/ReactComponents/GeocodeMap.jsx",
                    "~/ReactComponents/LocationStartEndPicker.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/huntview").Include(
                    "~/ReactComponents/GoogleMap.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/challengeview").Include(
                    "~/ReactComponents/ChallengeResult.jsx",
                    "~/ReactComponents/ChallengedApp.jsx",
                     "~/ReactComponents/ChallengerApp.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/challenge").Include(
                    "~/ReactComponents/ChallengeCreator.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/search").Include(
                    "~/ReactComponents/SearchApp.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/newlocations").Include(
                    "~/ReactComponents/GeoCodeMap.jsx",
                    "~/ReactComponents/NewLocationsPicker.jsx"
                ));

            bundles.Add(new JsxBundle("~/bundles/game").Include(
                    "~/js/gamemaster.js",                                        
                    "~/ReactComponents/GoogleMap.jsx",
                   "~/ReactComponents/TrueOrFalseGuesser.jsx",
                   "~/ReactComponents/TextGuesser.jsx",
                   "~/ReactComponents/NumberGuesser.jsx",
                   "~/ReactComponents/MultiGuesser.jsx",
                   "~/ReactComponents/LocationChecker.jsx",
                   "~/ReactComponents/RiddleGuesser.jsx",
                   "~/ReactComponents/QuestionGuesser.jsx",
                   "~/ReactComponents/CountDownTimer.jsx",
                   "~/ReactComponents/CorrectHunt.jsx",
                   "~/ReactComponents/ReviewForm.jsx",                   
                   "~/ReactComponents/GameApp.jsx"
                ));

            BundleTable.EnableOptimizations = true;
            

        }
    }
}
