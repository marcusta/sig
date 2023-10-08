using System;
using System.Security.AccessControl;
using UnityEngine;

namespace GSP_SigLogo {
    public enum GameType {
        StrokePlay = 0,
        AltShot = 1,
        Greensome = 2,
        Scramble = 3,
        Stableford = 4,
        Practice = 5
    }

    public enum Firmness {
        Normal = 0,
        Hard = 2,
        Soft = 4,
        Links = 3,
        Firm = 1
    }

    public enum Pins {
        Thursday = 0,
        Friday = 1,
        Saturday = 2,
        Sunday = 3,
        Easy = 0,
        Medium = 1,
        Hard = 2
    }

    public enum WindType {
        None = 0,
        Calm = 1,
        Breezy = 2,
        Gusty = 3,
        Turbulent = 4,
        Brutal = 5,
        AllOver = 6
    }


    public enum Elevation {
        Course = 0,
        Sealevel = 1
    }

    public class SigSettings {

        public string CourseName { get; set; }
        public string CourseFolderName { get; set; }

        public Pins Pins { get; set; }
        public int Tee { get; set; }
        public int Stimp { get; set; }
        public Firmness Fairways { get; set; }
        public Firmness Greens { get; set; }
        public WindType Wind { get; set; }

        public Elevation Elevation { get; set; }
        public GameType GameType { get; set; }
        public int Concede { get; set; }
        public int Gimmies { get; set; }
        public int Mulligans { get; set; }
        public int PlayMode { get; set; }

        public SigSettings (
            string courseName,
            string courseFolderName,
            Pins pins = Pins.Thursday,
            int tee = 0,
            int stimp = 11,
            Firmness fairways = Firmness.Normal,
            Firmness greens = Firmness.Normal,
            WindType wind = WindType.Calm)
        {
            CourseName = courseName;
            CourseFolderName = courseFolderName;
            Pins = pins;
            Tee = tee;
            Stimp = CalculateStimp (stimp);
            Fairways = fairways;
            Greens = greens;
            Wind = wind;
            Elevation = Elevation.Course;
            GameType = GameType.StrokePlay;
            Concede = 0;
            Gimmies = 2;
            Mulligans = 0;
            PlayMode = 1;
        }

        private int CalculateStimp (int actualStimp)
        {
            if (actualStimp >= 13) {
                return 5;
            } else if (actualStimp <= 8) {
                return 0;
            }
            return actualStimp - 8;
        }
    }
}

