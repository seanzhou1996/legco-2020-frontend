import axios from 'axios';
import {
  Constituency,
  Candidate,
  CandidateInfo,
} from 'constants/types';

export default class Remote {
  static constituencies: Constituency[];
  static candidates: Candidate[];
  static candidateInfoList: CandidateInfo[];

  static async setConstituencies() {
    const url = process.env.PUBLIC_URL + '/assets/constituencies.json';
    try {
      const res = await axios.get(url);
      if ([200, 201].includes(res.status)) {
        this.constituencies = res.data.constituencies;
      } else {
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
        this.candidates = res.data.candidates;
      } else {
        throw Error(res.statusText);
      }
    } catch (err) {
      throw err;
    }
  }

  static async setCandidateInfoList() {
    const url = process.env.PUBLIC_URL + '/assets/personalInfo.json';
    try {
      const res = await axios.get(url);
      if ([200, 201].includes(res.status)) {
        this.candidateInfoList = res.data;
      } else {
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

  static async getCandidateInfoList() {
    if (!this.candidateInfoList) {
      await this.setCandidateInfoList();
    }
    return this.candidateInfoList;
  }
}
