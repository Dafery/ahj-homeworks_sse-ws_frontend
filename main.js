/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/api/Entity.js
class Entity {
  list() {}
  get() {}
  create() {}
  update() {}
  delete() {}
}
;// CONCATENATED MODULE: ./src/js/api/ChatAPI.js

class ChatAPI extends Entity {
  constructor() {
    super();
    this.httpURL = "http://localhost:3000";
    this.wsURL = "ws://localhost:3000";
  }
  async postNewUser(payload) {
    try {
      const response = await fetch(`${this.httpURL}/new-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        return;
      }
      return await response.json();
    } catch {
      return {
        status: 500,
        message: "Network error"
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/js/utils.js
function createElementFromHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstChild;
}
;// CONCATENATED MODULE: ./src/js/components/Chat.js

class Chat {
  addChat() {
    const chatEl = createElementFromHTML(`<div class="container">
        <div class="chat__header">Чат</div>
        <div class="chat__container">
          <div class="chat__area">
            <ul class="chat__messages-container"></ul>
            <input class="chat__messages-input" placeholder="Type your message here">
          </div>
          <ul class="chat__userlist"></ul>
        </div>
      </div>`);
    this.chatMessagesContainerEl = chatEl.querySelector(".chat__messages-container");
    this.chatMessagesInput = chatEl.querySelector(".chat__messages-input");
    this.chatUserlistEl = chatEl.querySelector(".chat__userlist");
    return {
      chatEl,
      chatMessagesInput: this.chatMessagesInput
    };
  }
  addMessageContainerYourself(message) {
    this.chatMessagesInput.value = "";
    const messageContainerEl = createElementFromHTML(`<li class="message__container message__container-yourself"> 
        <div class="message__header">You</div>
        ${message.user.text}
      </li>`);
    this.chatMessagesContainerEl.append(messageContainerEl);
    this.scrollToLastMessage();
  }
  addMessageContainerInterlocutor(message) {
    const messageContainerEl = createElementFromHTML(`<li class="message__container message__container-interlocutor"> 
        <div class="message__header">${message.user.name}</div>
        ${message.user.text}
      </li>`);
    this.chatMessagesContainerEl.append(messageContainerEl);
    this.scrollToLastMessage();
  }
  addChatUsers(users) {
    this.chatUserlistEl.innerHTML = "";
    users.forEach(user => {
      const chatUserEl = createElementFromHTML(`<li class="chat__user">${user.name}</li>`);
      this.chatUserlistEl.append(chatUserEl);
    });
  }
  scrollToLastMessage() {
    this.chatMessagesContainerEl.scrollTop = this.chatMessagesContainerEl.scrollHeight - this.chatMessagesContainerEl.clientHeight;
  }
}
;// CONCATENATED MODULE: ./src/js/components/Modal.js

class Modal {
  addModal() {
    const modalEl = createElementFromHTML(`<div class="modal__background">
        <div class="modal__content">
          <div class="modal__header">Выберите псевдоним</div>        
          <div class="modal__body">
            <form class="form__group">
              <label class="form__label" for="nickname">Псевдоним</label>
              <input class="form__input" type="text" id="nickname">        
            </form>
          </div> 
          <div class="modal__footer">
            <button class="modal__ok">Продолжить</button>
            <button class="modal__close">Покинуть</button>
          </div> 
        </div> 
      </div>`);
    document.body.append(modalEl);
    this.formGroup = modalEl.querySelector(".form__group");
    const modalOk = modalEl.querySelector(".modal__ok");
    const modalClose = modalEl.querySelector(".modal__close");
    const formInput = modalEl.querySelector(".form__input");
    const onClose = () => {
      modalEl.remove();
    };
    return {
      modalOk,
      modalClose,
      formInput,
      onClose
    };
  }
  addFormHint(message) {
    const newFormHintEl = createElementFromHTML(`<div class="form__hint">${message}</div>`);
    const formHintEl = this.formGroup.querySelector(".form__hint");
    if (formHintEl) {
      return this.formGroup.replaceChild(newFormHintEl, formHintEl);
    }
    this.formGroup.append(newFormHintEl);
  }
}
;// CONCATENATED MODULE: ./src/js/Controller.js



class Controller {
  constructor() {
    this.container = null;
    this.api = new ChatAPI();
    this.websocket = null;
  }
  init() {
    const modal = new Modal();
    const {
      modalOk,
      modalClose,
      formInput,
      onClose
    } = modal.addModal();
    modalOk.addEventListener("click", async e => {
      e.preventDefault();
      if (!formInput.value) {
        return modal.addFormHint("The field cannot be empty!");
      }
      const res = await this.api.postNewUser({
        name: formInput.value
      });
      if (res) {
        return modal.addFormHint(res.message);
      }
      this.userName = formInput.value;
      this.registerEvents(formInput.value);
      onClose();
      this.chat = new Chat();
      const {
        chatEl,
        chatMessagesInput
      } = this.chat.addChat();
      this.container.append(chatEl);
      chatMessagesInput.addEventListener("keydown", e => {
        if (e.keyCode !== 13 || !e.target.value) {
          return;
        }
        const payload = JSON.stringify({
          type: "send",
          user: {
            name: this.userName,
            text: e.target.value
          }
        });
        this.websocket.send(payload);
      });
    });
    modalClose.addEventListener("click", e => {
      e.preventDefault();
      window.close();
    });
    window.onbeforeunload = () => {
      const payload = JSON.stringify({
        type: "exit",
        user: {
          name: this.userName
        }
      });
      this.websocket && this.websocket.send(payload);
    };
  }
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("container is not HTMLElement");
    }
    this.container = container;
  }
  registerEvents(payload) {
    this.websocket = new WebSocket(this.api.wsURL);
    this.websocket.addEventListener("open", () => {
      this.websocket.send(JSON.stringify({
        type: "connection",
        user: {
          name: payload
        }
      }));
    });
    this.websocket.addEventListener("message", e => {
      const data = JSON.parse(e.data);
      const isSend = Object.prototype.hasOwnProperty.call(data, "type");
      if (isSend) {
        return data.user.name === this.userName ? this.chat.addMessageContainerYourself(data) : this.chat.addMessageContainerInterlocutor(data);
      }
      const activeUsers = data.map(user => {
        if (user.name === this.userName) {
          user.name = "You";
        }
        return user;
      });
      this.chat.addChatUsers(activeUsers);
    });
  }
  subscribeOnEvents() {}
  onEnterChatHandler() {}
  sendMessage() {}
  renderMessage() {}
}
;// CONCATENATED MODULE: ./src/js/app.js

const root = document.getElementById("root");
const controller = new Controller();
controller.bindToDOM(root);
controller.init();
;// CONCATENATED MODULE: ./src/index.js



/******/ })()
;