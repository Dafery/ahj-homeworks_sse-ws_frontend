import ChatAPI from "./api/ChatAPI";
import Chat from "./components/Chat";
import Modal from "./components/Modal";

export default class Controller {
  constructor() {
    this.container = null;
    this.api = new ChatAPI();
    this.websocket = null;
  }

  init() {
    const modal = new Modal();
    const { modalOk, modalClose, formInput, onClose } = modal.addModal();

    modalOk.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!formInput.value) {
        return modal.addFormHint("The field cannot be empty!");
      }

      const res = await this.api.postNewUser({ name: formInput.value });
      if (res) {
        return modal.addFormHint(res.message);
      }

      this.userName = formInput.value;
      this.registerEvents(formInput.value);
      onClose();

      this.chat = new Chat();
      const { chatEl, chatMessagesInput } = this.chat.addChat();

      this.container.append(chatEl);

      chatMessagesInput.addEventListener("keydown", (e) => {
        if (e.keyCode !== 13 || !e.target.value) {
          return;
        }

        const payload = JSON.stringify({
          type: "send",
          user: {
            name: this.userName,
            text: e.target.value,
          },
        });
        this.websocket.send(payload);
      });
    });

    modalClose.addEventListener("click", (e) => {
      e.preventDefault();
      window.close();
    });

    window.onbeforeunload = () => {
      const payload = JSON.stringify({
        type: "exit",
        user: { name: this.userName },
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
      this.websocket.send(
        JSON.stringify({
          type: "connection",
          user: { name: payload },
        })
      );
    });

    this.websocket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      const isSend = Object.prototype.hasOwnProperty.call(data, "type");
      if (isSend) {
        return data.user.name === this.userName
          ? this.chat.addMessageContainerYourself(data)
          : this.chat.addMessageContainerInterlocutor(data);
      }

      const activeUsers = data.map((user) => {
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
