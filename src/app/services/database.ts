import { Injectable } from '@angular/core';

import { StorageService } from './storage';
import { Theme } from './theme';

export interface Team {
  id: number;
  name: string;
  short_name: string;
  group_name: string;
}

export interface Match {
  id: number;
  id_team_1: number;
  id_team_2: number;
  score_team_1: number;
  extra_score_team_1: number;
  score_team_2: number;
  extra_score_team_2: number;
  channel: string;
  date: string;
  time: string;
  note: string;
  played: boolean
  type: MatchType
}

export type MatchType =
  "Groupe A" |
  "Groupe B" |
  "Groupe C" |
  "Groupe D" |
  "Groupe E" |
  "Groupe F" |
  "Groupe G" |
  "Groupe H" |
  "Groupe I" |
  "Groupe J" |
  "Groupe K" |
  "Groupe L" |
  "1/16" | "1/8" | "1/4" | "1/2" |
  "Petite finale" | "Finale"

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  db: any = {
    teams: [
      // Défaut
      {id: 0, name: "Indéterminé", short_name: "???", group_name: "X"},

      // Groupe A
      { id: 1, name: "Mexique", short_name: "MEX", group_name: "A" },
      { id: 2, name: "Afrique du Sud", short_name: "RSA", group_name: "A" },
      { id: 3, name: "Corée du Sud", short_name: "KOR", group_name: "A" },
      { id: 4, name: "XXX", short_name: "XXX", group_name: "A" },

      // Groupe B
      { id: 5, name: "Canada", short_name: "CAN", group_name: "B" },
      { id: 6, name: "XXX", short_name: "XXX", group_name: "B" },
      { id: 7, name: "Qatar", short_name: "QAT", group_name: "B" },
      { id: 8, name: "Suisse", short_name: "SUI", group_name: "B" },

      // Groupe C
      { id: 9, name: "Brésil", short_name: "BRA", group_name: "C" },
      { id: 10, name: "Maroc", short_name: "MAR", group_name: "C" },
      { id: 11, name: "Haïti", short_name: "HAI", group_name: "C" },
      { id: 12, name: "Écosse", short_name: "SCO", group_name: "C" },

      // Groupe D
      { id: 13, name: "États-Unis", short_name: "USA", group_name: "D" },
      { id: 14, name: "Paraguay", short_name: "PAR", group_name: "D" },
      { id: 15, name: "Australie", short_name: "AUS", group_name: "D" },
      { id: 16, name: "XXX", short_name: "XXX", group_name: "D" },

      // Groupe E
      { id: 17, name: "Allemagne", short_name: "GER", group_name: "E" },
      { id: 18, name: "Curaçao", short_name: "CUW", group_name: "E" },
      { id: 19, name: "Côte d'Ivoire", short_name: "CIV", group_name: "E" },
      { id: 20, name: "Équateur", short_name: "ECU", group_name: "E" },

      // Groupe F
      { id: 21, name: "Pays-Bas", short_name: "NED", group_name: "F" },
      { id: 22, name: "Japon", short_name: "JPN", group_name: "F" },
      { id: 23, name: "XXX", short_name: "XXX", group_name: "F" },
      { id: 24, name: "Tunisie", short_name: "TUN", group_name: "F" },

      // Groupe G
      { id: 25, name: "Belgique", short_name: "BEL", group_name: "G" },
      { id: 26, name: "Égypte", short_name: "EGY", group_name: "G" },
      { id: 27, name: "Iran", short_name: "IRN", group_name: "G" },
      { id: 28, name: "Nouvelle-Zélande", short_name: "NZL", group_name: "G" },

      // Groupe H
      { id: 29, name: "Espagne", short_name: "ESP", group_name: "H" },
      { id: 30, name: "Cap-Vert", short_name: "CPV", group_name: "H" },
      { id: 31, name: "Arabie saoudite", short_name: "KSA", group_name: "H" },
      { id: 32, name: "Uruguay", short_name: "URU", group_name: "H" },

      // Groupe I
      { id: 33, name: "France", short_name: "FRA", group_name: "I" },
      { id: 34, name: "Sénégal", short_name: "SEN", group_name: "I" },
      { id: 35, name: "XXX", short_name: "XXX", group_name: "I" },
      { id: 36, name: "Norvège", short_name: "NOR", group_name: "I" },

      // Groupe J
      { id: 37, name: "Argentine", short_name: "ARG", group_name: "J" },
      { id: 38, name: "Algérie", short_name: "ALG", group_name: "J" },
      { id: 39, name: "Autriche", short_name: "AUT", group_name: "J" },
      { id: 40, name: "Jordanie", short_name: "JOR", group_name: "J" },

      // Groupe K
      { id: 41, name: "Portugal", short_name: "POR", group_name: "K" },
      { id: 42, name: "XXX", short_name: "XXX", group_name: "K" },
      { id: 43, name: "Ouzbékistan", short_name: "UZB", group_name: "K" },
      { id: 44, name: "Colombie", short_name: "COL", group_name: "K" },

      // Groupe L
      { id: 45, name: "Angleterre", short_name: "ENG", group_name: "L" },
      { id: 46, name: "Croatie", short_name: "CRO", group_name: "L" },
      { id: 47, name: "Ghana", short_name: "GHA", group_name: "L" },
      { id: 48, name: "Panama", short_name: "PAN", group_name: "L" },
    ],

    matches: [
      // Groupe A
      { id: 1, id_team_1: 1, id_team_2: 2, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "11/01", time: "21:00", note: "-", played: false, type: "Groupe A" },
      { id: 2, id_team_1: 3, id_team_2: 4, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "12/01", time: "04:00", note: "-", played: false, type: "Groupe A" },
      { id: 3, id_team_1: 4, id_team_2: 2, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "18/01", time: "18:00", note: "-", played: false, type: "Groupe A" },
      { id: 4, id_team_1: 1, id_team_2: 3, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "19/01", time: "03:00", note: "-", played: false, type: "Groupe A" },
      { id: 5, id_team_1: 2, id_team_2: 3, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/01", time: "03:00", note: "-", played: false, type: "Groupe A" },
      { id: 6, id_team_1: 4, id_team_2: 1, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/01", time: "03:00", note: "-", played: false, type: "Groupe A" },

      // Groupe B
      { id: 7, id_team_1: 5, id_team_2: 6, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "12/01", time: "21:00", note: "-", played: false, type: "Groupe B" },
      { id: 8, id_team_1: 7, id_team_2: 8, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "13/01", time: "21:00", note: "-", played: false, type: "Groupe B" },
      { id: 9, id_team_1: 8, id_team_2: 6, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "18/01", time: "21:00", note: "-", played: false, type: "Groupe B" },
      { id: 10, id_team_1: 5, id_team_2: 7, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "19/01", time: "00:00", note: "-", played: false, type: "Groupe B" },
      { id: 11, id_team_1: 8, id_team_2: 5, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "24/01", time: "21:00", note: "-", played: false, type: "Groupe B" },
      { id: 12, id_team_1: 6, id_team_2: 7, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "24/01", time: "21:00", note: "-", played: false, type: "Groupe B" },

      // Groupe C
      { id: 13, id_team_1: 9, id_team_2: 10, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/01", time: "00:00", note: "-", played: false, type: "Groupe C" },
      { id: 14, id_team_1: 11, id_team_2: 12, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/01", time: "03:00", note: "-", played: false, type: "Groupe C" },
      { id: 15, id_team_1: 12, id_team_2: 10, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "20/01", time: "00:00", note: "-", played: false, type: "Groupe C" },
      { id: 16, id_team_1: 9, id_team_2: 11, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "20/06", time: "03:00", note: "-", played: false, type: "Groupe C" },
      { id: 17, id_team_1: 10, id_team_2: 11, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/06", time: "00:00", note: "-", played: false, type: "Groupe C" },
      { id: 18, id_team_1: 12, id_team_2: 9, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/06", time: "00:00", note: "-", played: false, type: "Groupe C" },

      // Groupe D
      { id: 19, id_team_1: 13, id_team_2: 14, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "13/06", time: "03:00", note: "-", played: false, type: "Groupe D" },
      { id: 20, id_team_1: 15, id_team_2: 16, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/06", time: "06:00", note: "-", played: false, type: "Groupe D" },
      { id: 21, id_team_1: 13, id_team_2: 15, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "19/06", time: "21:00", note: "-", played: false, type: "Groupe D" },
      { id: 22, id_team_1: 16, id_team_2: 14, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "20/06", time: "06:00", note: "-", played: false, type: "Groupe D" },
      { id: 23, id_team_1: 16, id_team_2: 13, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "04:00", note: "-", played: false, type: "Groupe D" },
      { id: 24, id_team_1: 14, id_team_2: 15, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "04:00", note: "-", played: false, type: "Groupe D" },

      // Groupe E
      { id: 25, id_team_1: 17, id_team_2: 18, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/06", time: "19:00", note: "-", played: false, type: "Groupe E" },
      { id: 26, id_team_1: 19, id_team_2: 20, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "15/06", time: "01:00", note: "-", played: false, type: "Groupe E" },
      { id: 27, id_team_1: 17, id_team_2: 19, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "20/06", time: "22:00", note: "-", played: false, type: "Groupe E" },
      { id: 28, id_team_1: 20, id_team_2: 18, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "21/06", time: "02:00", note: "-", played: false, type: "Groupe E" },
      { id: 29, id_team_1: 18, id_team_2: 19, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/06", time: "22:00", note: "-", played: false, type: "Groupe E" },
      { id: 30, id_team_1: 20, id_team_2: 18, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "25/06", time: "22:00", note: "-", played: false, type: "Groupe E" },

      // Groupe F
      { id: 31, id_team_1: 21, id_team_2: 22, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/06", time: "22:00", note: "-", played: false, type: "Groupe F" },
      { id: 32, id_team_1: 23, id_team_2: 24, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "15/06", time: "04:00", note: "-", played: false, type: "Groupe F" },
      { id: 33, id_team_1: 21, id_team_2: 23, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "20/06", time: "19:00", note: "-", played: false, type: "Groupe F" },
      { id: 34, id_team_1: 24, id_team_2: 22, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "21/06", time: "06:00", note: "-", played: false, type: "Groupe F" },
      { id: 35, id_team_1: 24, id_team_2: 21, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "01:00", note: "-", played: false, type: "Groupe F" },
      { id: 36, id_team_1: 22, id_team_2: 23, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "01:00", note: "-", played: false, type: "Groupe F" },

      // Groupe G
      { id: 37, id_team_1: 25, id_team_2: 26, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "15/06", time: "21:00", note: "-", played: false, type: "Groupe G" },
      { id: 38, id_team_1: 27, id_team_2: 28, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "16/06", time: "03:00", note: "-", played: false, type: "Groupe G" },
      { id: 39, id_team_1: 25, id_team_2: 27, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "21/06", time: "21:00", note: "-", played: false, type: "Groupe G" },
      { id: 40, id_team_1: 28, id_team_2: 26, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "22/06", time: "03:00", note: "-", played: false, type: "Groupe G" },
      { id: 41, id_team_1: 28, id_team_2: 25, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "05:00", note: "-", played: false, type: "Groupe G" },
      { id: 42, id_team_1: 26, id_team_2: 27, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "05:00", note: "-", played: false, type: "Groupe G" },

      // Groupe H
      { id: 43, id_team_1: 29, id_team_2: 30, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "15/06", time: "18:00", note: "-", played: false, type: "Groupe H" },
      { id: 44, id_team_1: 31, id_team_2: 32, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "16/06", time: "00:00", note: "-", played: false, type: "Groupe H" },
      { id: 45, id_team_1: 29, id_team_2: 31, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "21/06", time: "18:00", note: "-", played: false, type: "Groupe H" },
      { id: 46, id_team_1: 32, id_team_2: 30, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "22/06", time: "00:00", note: "-", played: false, type: "Groupe H" },
      { id: 47, id_team_1: 30, id_team_2: 31, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "02:00", note: "-", played: false, type: "Groupe H" },
      { id: 48, id_team_1: 32, id_team_2: 29, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "02:00", note: "-", played: false, type: "Groupe H" },

      // Groupe I
      { id: 49, id_team_1: 33, id_team_2: 34, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "16/06", time: "21:00", note: "-", played: false, type: "Groupe I" },
      { id: 50, id_team_1: 35, id_team_2: 36, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "17/06", time: "00:00", note: "-", played: false, type: "Groupe I" },
      { id: 51, id_team_1: 33, id_team_2: 35, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "22/06", time: "23:00", note: "-", played: false, type: "Groupe I" },
      { id: 52, id_team_1: 36, id_team_2: 34, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "23/06", time: "02:00", note: "-", played: false, type: "Groupe I" },
      { id: 53, id_team_1: 36, id_team_2: 33, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "21:00", note: "-", played: false, type: "Groupe I" },
      { id: 54, id_team_1: 34, id_team_2: 35, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "26/06", time: "21:00", note: "-", played: false, type: "Groupe I" },

      // Groupe J
      { id: 55, id_team_1: 37, id_team_2: 38, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "17/06", time: "03:00", note: "-", played: false, type: "Groupe J" },
      { id: 56, id_team_1: 39, id_team_2: 40, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "17/06", time: "06:00", note: "-", played: false, type: "Groupe J" },
      { id: 57, id_team_1: 37, id_team_2: 39, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "22/06", time: "19:00", note: "-", played: false, type: "Groupe J" },
      { id: 58, id_team_1: 40, id_team_2: 38, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "23/06", time: "05:00", note: "-", played: false, type: "Groupe J" },
      { id: 59, id_team_1: 38, id_team_2: 39, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "28/06", time: "04:00", note: "-", played: false, type: "Groupe J" },
      { id: 60, id_team_1: 40, id_team_2: 37, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "28/06", time: "04:00", note: "-", played: false, type: "Groupe J" },

      // Groupe K
      { id: 61, id_team_1: 41, id_team_2: 42, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "17/06", time: "19:00", note: "-", played: false, type: "Groupe K" },
      { id: 62, id_team_1: 43, id_team_2: 44, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "18/06", time: "04:00", note: "-", played: false, type: "Groupe K" },
      { id: 63, id_team_1: 41, id_team_2: 43, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "23/06", time: "19:00", note: "-", played: false, type: "Groupe K" },
      { id: 64, id_team_1: 44, id_team_2: 42, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "24/06", time: "04:00", note: "-", played: false, type: "Groupe K" },
      { id: 65, id_team_1: 44, id_team_2: 41, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "28/06", time: "01:30", note: "-", played: false, type: "Groupe K" },
      { id: 66, id_team_1: 42, id_team_2: 43, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "28/06", time: "01:30", note: "-", played: false, type: "Groupe K" },

      // Groupe L
      { id: 67, id_team_1: 45, id_team_2: 46, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "17/06", time: "22:00", note: "-", played: false, type: "Groupe L" },
      { id: 68, id_team_1: 48, id_team_2: 47, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "18/06", time: "01:00", note: "-", played: false, type: "Groupe L" },
      { id: 69, id_team_1: 45, id_team_2: 47, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "23/06", time: "22:00", note: "-", played: false, type: "Groupe L" },
      { id: 70, id_team_1: 48, id_team_2: 46, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "24/06", time: "01:00", note: "-", played: false, type: "Groupe L" },
      { id: 71, id_team_1: 48, id_team_2: 45, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "23:00", note: "-", played: false, type: "Groupe L" },
      { id: 72, id_team_1: 46, id_team_2: 47, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "27/06", time: "23:00", note: "-", played: false, type: "Groupe L" },

      // Seizièmes de finale (16)
      { id: 73,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "28/01", time: "21:00", note: "2ème A, 2ème B", played: false, type: "1/16" },
      { id: 74,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "30/01", time: "03:00", note: "1er F, 2ème C", played: false, type: "1/16" },
      { id: 75,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "29/01", time: "22:30", note: "1er E, 3ème A/B/C/D/F", played: false, type: "1/16" },
      { id: 76,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "30/01", time: "23:00", note: "1er I, 3ème C/D/F/G/H", played: false, type: "1/16" },
      { id: 77,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "01/02", time: "22:00", note: "1er G, 3ème A/E/H/I/J", played: false, type: "1/16" },
      { id: 78,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "02/02", time: "02:00", note: "1er D, 3ème B/E/F/I/J", played: false, type: "1/16" },
      { id: 79,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "02/02", time: "21:00", note: "1er H, 2ème J", played: false, type: "1/16" },
      { id: 80,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "03/02", time: "01:00", note: "2ème K, 2ème L", played: false, type: "1/16" },
      { id: 81,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "29/01", time: "19:00", note: "1er C, 2ème F", played: false, type: "1/16" },
      { id: 82,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "30/01", time: "19:00", note: "2ème E, 2ème I", played: false, type: "1/16" },
      { id: 83,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "01/02", time: "03:00", note: "1er A, 3ème C/E/F/H/I", played: false, type: "1/16" },
      { id: 84,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "01/02", time: "18:00", note: "1er L, 3ème E/H/I/J/K", played: false, type: "1/16" },
      { id: 85,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "03/02", time: "05:00", note: "1er B, 3ème E/F/G/I/J", played: false, type: "1/16" },
      { id: 86,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "04/02", time: "03:30", note: "1er K, 3ème D/E/I/J/L", played: false, type: "1/16" },
      { id: 87,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "03/02", time: "20:00", note: "2ème K, 2ème L", played: false, type: "1/16" },
      { id: 88,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "04/02", time: "00:00", note: "1er J, 2ème H", played: false, type: "1/16" },

      // Huitièmes de finale (8)
      { id: 89,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "04/02", time: "19:00", note: "-", played: false, type: "1/8" },
      { id: 90,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "04/02", time: "23:00", note: "-", played: false, type: "1/8" },
      { id: 91,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "07/02", time: "02:00", note: "-", played: false, type: "1/8" },
      { id: 92,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "06/02", time: "21:00", note: "-", played: false, type: "1/8" },
      { id: 93,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "05/02", time: "22:00", note: "-", played: false, type: "1/8" },
      { id: 94,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "06/02", time: "02:00", note: "-", played: false, type: "1/8" },
      { id: 95,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "07/02", time: "22:00", note: "-", played: false, type: "1/8" },
      { id: 96,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "07/02", time: "18:00", note: "-", played: false, type: "1/8" },

      // Quarts de finale (4)
      { id: 97,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "09/02", time: "22:00", note: "-", played: false, type: "1/4" },
      { id: 98,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "10/02", time: "21:00", note: "-", played: false, type: "1/4" },
      { id: 99,  id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "11/02", time: "23:00", note: "-", played: false, type: "1/4" },
      { id: 100, id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "12/02", time: "03:00", note: "-", played: false, type: "1/4" },

      // Demi-finales (2)
      { id: 101, id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "14/02", time: "21:00", note: "-", played: false, type: "1/2" },
      { id: 102, id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "15/02", time: "21:00", note: "-", played: false, type: "1/2" },

      // Petite finale (1)
      { id: 103, id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "18/02", time: "23:00", note: "-", played: false, type: "Petite finale" },

      // Finale (1)
      { id: 104, id_team_1: 0, id_team_2: 0, score_team_1: 0, extra_score_team_1: 0, score_team_2: 0, extra_score_team_2: 0, channel: "-", date: "19/02", time: "21:00", note: "-", played: false, type: "Finale" },
    ]
  }

  channels: string[] = [
    "TF1",
    "France 2",
    "France 3",
    "M6",
    "W9",
    "-"
  ]

  themes: Theme[] = [
    "Football",
    "Clair",
    "Sombre"
  ]

  constructor(
    private storage: StorageService
  ) { }

  async get() {
    return await this.storage.get("db") || this.db;
  }

  async update(db: any) {
    await this.storage.set("db", db);
  }

  async updateTable(tableName: string, table: any) {
    let db = await this.get();
    db[tableName] = table;
    await this.storage.set("db", db);
  }

  async getTable(tableName: string) {
    let db = await this.get();
    return db[tableName];
  }
}