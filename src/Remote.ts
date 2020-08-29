import axios from 'axios';
import {
  Constituency,
  Candidate,
  PersonalInfo,
} from 'constants/types';

export default class Remote {
  static constituencies: Constituency[];
  static candidates: Candidate[];
  static personalInfoList: PersonalInfo[];

  static async setConstituencies() {
    const url = process.env.PUBLIC_URL + '/assets/constituencies.json';
    try {
      const res = await axios.get(url);
      if ([200, 201].includes(res.status)) {
        this.constituencies = res.data;
      } else {
        this.constituencies = [];
        throw Error(res.statusText);
      }
    } catch (err) {
      throw err;
    }
  }

  static async setCandidates() {
    const url = process.env.PUBLIC_URL + '/assets/candidates.json';
    try {
      const res = await axios.get(url);
      if ([200, 201].includes(res.status)) {
        this.candidates = res.data;
      } else {
        this.candidates = [];
        throw Error(res.statusText);
      }
    } catch (err) {
      throw err;
    }
  }

  static async setPersonalInfoList() {
    const url = process.env.PUBLIC_URL + '/assets/personalInfo.json';
    try {
      const res = await axios.get(url);
      if ([200, 201].includes(res.status)) {
        this.personalInfoList = res.data;
      } else {
        this.personalInfoList = [];
        throw Error(res.statusText);
      }
    } catch (err) {
      throw err;
    }
  }

  static async getConstituencies() {
    if (!this.constituencies) {
      await this.setConstituencies();
    }
    return this.constituencies;
  }

  static async getCandidates() {
    if (!this.candidates) {
      await this.setCandidates();
    }
    return this.candidates;
  }

  static async getPersonalInfoList() {
    if (!this.personalInfoList) {
      await this.setPersonalInfoList();
    }
    return this.personalInfoList;
  }
}
