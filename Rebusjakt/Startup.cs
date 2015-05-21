using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Rebusjakt.Startup))]
namespace Rebusjakt
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
