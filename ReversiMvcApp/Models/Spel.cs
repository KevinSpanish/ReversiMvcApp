using System.ComponentModel.DataAnnotations;

namespace ReversiMvcApp.Models
{
    public enum Color
    {
        None,
        White,
        Black
    }

    public class Spel
    {
        [Key]
        public int ID { get; set; }
        public string Omschrijving { get; set; }
        public string Token { get; set; }
        public string Speler1Token { get; set; }
        public string Speler2Token { get; set; }
        //public string Winnaar { get; set; }
        public string Gewonnen { get; set; }
    }
}
