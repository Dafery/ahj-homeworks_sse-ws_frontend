import { createElementFromHTML } from "../utils";

export default class Chat {
  addChat() {
    const chatEl = createElementFromHTML(
      `<div class="container">
        <div class="chat__header">Чат</div>
        <div class="chat__container">
          <div class="chat__area">
            <ul class="chat__messages-container"></ul>
            <input class="chat__messages-input" placeholder="Type your message here">
          </div>
          <ul class="chat__userlist"></ul>
        </div>
      </div>`
    );

    this.chatMessagesContainerEl = chatEl.querySelector(
      ".chat__messages-container"
    );
    this.chatMessagesInput = chatEl.querySelector(".chat__messages-input");
    this.chatUserlistEl = chatEl.querySelector(".chat__userlist");

    return { chatEl, chatMessagesInput: this.chatMessagesInput };
  }

  addMessageContainerYourself(message) {
    this.chatMessagesInput.value = "";
    const messageContainerEl = createElementFromHTML(
      `<li class="message__container message__container-yourself"> 
        <div class="message__header">You</div>
        ${message.user.text}
      </li>`
    );
    this.chatMessagesContainerEl.append(messageContainerEl);

    this.scrollToLastMessage();
  }

  addMessageContainerInterlocutor(message) {
    const messageContainerEl = createElementFromHTML(
      `<li class="message__container message__container-interlocutor"> 
        <div class="message__header">${message.user.name}</div>
        ${message.user.text}
      </li>`
    );
    this.chatMessagesContainerEl.append(messageContainerEl);

    this.scrollToLastMessage();
  }

  addChatUsers(users) {
    this.chatUserlistEl.innerHTML = "";
    users.forEach((user) => {
      const chatUserEl = createElementFromHTML(
        `<li class="chat__user">${user.name}</li>`
      );
      this.chatUserlistEl.append(chatUserEl);
    });
  }

  scrollToLastMessage() {
    this.chatMessagesContainerEl.scrollTop =
      this.chatMessagesContainerEl.scrollHeight -
      this.chatMessagesContainerEl.clientHeight;
  }
}
