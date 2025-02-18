

namespace server.Models
{
    public class InitialFormMessage
    {
        public string Sender { get; set; }
        public string Message { get; set; }
        
        public DateTime Timestamp { get; set; }
        public string ChatToken { get; set; }
    }
}