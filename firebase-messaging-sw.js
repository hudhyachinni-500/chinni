if ("undefined" === typeof window) {
  importScripts("https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js");
  importScripts("https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js");
}

/**
 * @class PushlyFirebaseListener
 */
class PushlyFirebaseListener {
  /**
   * @constructor
   */
  constructor() {
    // Store messageApi of current executed message when user clicks on the message
    this.exeMessageApi = "";

    // Store jwt token which has domainId, flowId, messageId
    this.messageApi = "";

    // Fcm subscription object
    this.subscriptionObject = {};

    // Store event action url
    this.url = "";

    // Store current domain url
    this.launchUrl = "";

    // Store push object
    this.pushObj = "";

    // Store Message Id
    this.message_id = "";

    // Check event
    this.execute = false;
  }

  /**
   * Initialization method
   */
  init() {
    // To listen the messages pushed from service worker
    self.addEventListener("push", (event) => {
      this.execute = false;
      var message = event.data.json();
      console.log("message", message);
      if (message.data.hasOwnProperty("data")) {
        this.pushObj = JSON.parse(message.data.data);
        this.message_id = this.pushObj.message_id;
        this.launchUrl = this.pushObj.launch_url;
        var obj = JSON.parse(message.data.notification);
      } else if (!message.data.hasOwnProperty("data")) {
        var obj = JSON.parse(message.data.notification);
      }
      // let encoded_data = this.encode("<p>sdfgsgg<span class=\"ql-emojiblot\" data-name=\"neutral_face\">﻿<span contenteditable=\"false\"><span class=\"ap ap-neutral_face\">😐</span></span>﻿</span></p>");
      // console.log("encoded_data", encoded_data);
      var myBlobParts = ['<html><h2>This is heading</h2></html>']["<html><p>sdfgsgg<span class=\"ql-emojiblot\" data-name=\"neutral_face\">﻿<span contenteditable=\"false\"><span class=\"ap ap-neutral_face\">😐</span></span>﻿</span></p></html>"];
       let blob = new Blob(myBlobParts, {type: 'text/html', endings: "transparent"}
  );
    console.log("blob..",blob);
    
     const title = obj.title;
      const options = {
        body:blob,
        icon: obj.icon,
        image: obj.image,
      };
     
      if (message.data.action_button) {
        options["actions"] = JSON.parse(message.data.action_button);
      }
      console.log("title..",title);
      event.waitUntil(self.registration.showNotification(title, options));
    });

    // To listen when user clicks on notification
    self.addEventListener("notificationclose", (event) => {
      console.log("notificationclose", event);
      const clickedNotification = event.notification;
      if (this.message_id && !this.execute) this.saveUserAction("close", "Unclicked");
    });

    // To listen when user closes notification
    self.addEventListener("notificationclick", (event) => {
      this.execute = true;
      console.log("notificationclick", event);
      // Redirect to website which is given by subscriber
      if (this.launchUrl) clients.openWindow(this.launchUrl);
      const clickedNotification = event.notification;
      if (this.message_id) this.saveUserAction(event.action ? event.action : "executed", "Clicked");
      // Reset variable
      this.exeMessageApi = "";
    });
  }

  /**
   * To make a network call and store messages in database
   */
  saveUserAction(actionText, result) {
    this.pushObj.action = result;
    this.pushObj.user_action = actionText;
    var messagelog = this.pushObj;
    fetch(`https://my.${this.pushObj.region}.500apps.com/pcors?url=https://push.${this.pushObj.region}.500apps.com/push/v1/message/log?app_name=push`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.pushObj.api_key,
      },
      body: JSON.stringify(messagelog),
    });
  }
   // Encode json data
   encode(s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      out[i] = s.charCodeAt(i);
    }
    return new Uint8Array(out);
  }

}
(() => {
  var _pushlyFirebaseListener = new PushlyFirebaseListener();
  _pushlyFirebaseListener.init();
})();
