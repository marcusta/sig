export type CourseManifestList = CourseManifest[];

export interface CourseManifest {
  url: string;
  courseList: Course[];
  folder: string;
}

export interface CourseToDownload {
  course: Course;
  targetFolder: string;
}

/*
Example course json
    {
        "coursekey": "TorreySouth",
        "Name": "Torrey South",
        "ElevationInFeet": 105,
        "DownloadURL": "https:\/\/sgtloadbalancer.herokuapp.com\/?courseDL=TorreySouth",
        "DownloadURL2": "https:\/\/www.mediafire.com\/file\/pprx0zognc0wxlz\/torrey_pines_south_v3_gsp.zip\/file",
        "DownloadURL3": "https:\/\/dtrz37ctsyu07.cloudfront.net\/torrey_pines_south_v3_gsp.zip",
        "RemoteVersion": "3",
        "LastUpdated": "2023-07-27",
        "CourseLocation": "La Jolla, CA",
        "CourseDesigner": "Johnmeyer",
        "Par": 72,
        "KidFriendly": "true",
        "CourseFolder": "torrey_pines_south_v3_gsp",
        "GKDVersion": "2",
        "GKDDownloadURL": "https:\/\/dkfomfzm5un6c.cloudfront.net\/torrey_pines_south_v3_gsp.zip",
        "MetaDataRemoteVersion": "1",
        "MetaDataDownloadURL": null,
        "Images": "[]",
        "Videos": "[]",
        "remoteThumbnailImage": null,
        "KeywordBeginnerFriendly": null,
        "KeywordCoastal": null,
        "KeywordDesert": null,
        "KeywordFantasy": null,
        "KeywordHeathland": null,
        "KeywordHistoric": null,
        "KeywordLinks": null,
        "KeywordLowPoly": null,
        "KeywordMajorVenue": null,
        "KeywordMountain": null,
        "KeywordParkland": null,
        "KeywordTourStop": null,
        "KeywordTraining": null,
        "KeywordTropical": null
    },
*/

export type FullManifest = Course[];

export interface Course {
  courseKey: string;
  Name: string;
  ElevationInFeet: number;
  DownloadURL: string;
  DownloadURL2: string;
  DownloadURL3: string;
  RemoteVersion: string;
  LastUpdated: string;
  CourseLocation: string;
  CourseDesigner: string;
  Par: number;
  KidFriendly: boolean;
  CourseFolder: string;
  GkdVersion: string;
  GkdDownloadUrl: string;
  MetaDataRemoteVersion: string;
  MetaDataDownloadUrl: string;
  Images: string;
  Videos: string;
  remoteThumbnailImage: string;
  KeywordBeginnerFriendly: string;
  KeywordCoastal: string;
  KeywordDesert: string;
  KeywordFantasy: string;
  KeywordHeathland: string;
  KeywordHistoric: string;
  KeywordLinks: string;
  KeywordLowPoly: string;
  KeywordMajorVenue: string;
  KeywordMountain: string;
  KeywordParkland: string;
  KeywordTourStop: string;
  KeywordTraining: string;
  KeywordTropical: string;
}
