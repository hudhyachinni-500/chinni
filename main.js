import './global.css';
import Widget from './widget/widget';
import SSO from './sso/sso';
import Modal from './util/modal.js';
import JWT from './util/jwt.js';
import OAuth from './oauth/oauth.js';
import Twilio from "./widget/twilio.js";
import FilePicker from "./filepicker/filepicker.js";
const Apps = require("./apps.json");
const Widget_URL = "https://plugins.500apps.com";
const URL = "https://plugins.500apps.com/plugins";

export default class Unified {
  constructor() {
    this.callback  = "";
    this.apiKey = ''; // Store API Key
  }

  /**
   * Initialization method (starting point)
   * @param {String} apiKey - Developer api key
   */
  init(apiKey,callback) {
    this.callback = callback;
    this.apiKey = apiKey;
    this.region = JWT.getRegion();
    return this;
  }

  getSSO() {
    OAuth.URL = URL;
    return SSO;
  }

  getWidget() {
    OAuth.URL = Widget_URL;
    return Widget;
  }

  getOAuth() {
    OAuth.URL = URL;
    return OAuth;
  }

  getModal() {
    return Modal;
  }

  getApps() {
    return Apps;
  }

  getTwilio() {
    return Twilio;
  }

  getFilePicker(){
    return FilePicker;
  }

}
(() => {
  window._AppletIO = new Unified();
})();
