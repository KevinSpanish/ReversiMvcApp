using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Data
{
    public class ReversiRestApiService
    {
        private readonly HttpClient httpClient;

        public ReversiRestApiService()
        {
            httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("localhost:5000");
        }

        public List<Spel> GetGamesPending()
        {
            var result = httpClient.GetAsync("/api/spel/").Result;
            if (result.IsSuccessStatusCode)
            {
                List<Spel> objecten = new();
                objecten = result.Content.ReadAsAsync<List<Spel>>().Result;

                return objecten;
            }
            else
            {
                return null;
            }
        }

        public Spel GetGame(string token)
        {
            Spel objects = null;
            var result = httpClient.GetAsync($"/api/spel/{token}").Result;
            if (result.IsSuccessStatusCode)
            {
                objects = result.Content.ReadAsAsync<Spel>().Result;
            }

            return objects;
        }

        public Spel GetGameByPlayer(string playerToken)
        {
            Spel objects = null;
            var result = httpClient.GetAsync($"/api/spel/speler/{playerToken}").Result;
            if (result.IsSuccessStatusCode)
            {
                objects = result.Content.ReadAsAsync<Spel>().Result;
            }

            return objects;
        }

        public Spel CreateGame(string spelerToken, string omschrijving)
        {
            Spel objecten = null;
            var formContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("speler1Token", spelerToken),
                new KeyValuePair<string, string>("omschrijving", omschrijving)
            });

            HttpResponseMessage result = httpClient.PostAsync($"/api/Spel/", formContent).Result;
            if (result.IsSuccessStatusCode)
            {
                objecten = result.Content.ReadAsAsync<Spel>().Result;
            }

            return objecten;
        }

        public Spel JoinGame(string spelToken, string spelerToken)
        {
            Spel objects = null;

            var formContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("spelerToken", spelerToken),
            });

            HttpResponseMessage result = httpClient.PostAsync(
                $"/api/Spel/{spelToken}/join/", formContent).Result;
            if (result.IsSuccessStatusCode)
            {
                objects = result.Content.ReadAsAsync<Spel>().Result;
            }

            return objects;
        }

        public bool Delete(string spelToken)
        {
            var result = httpClient.DeleteAsync($"/api/spel/{spelToken}/verwijder").Result;
            return result.IsSuccessStatusCode;
        }
    }
}
