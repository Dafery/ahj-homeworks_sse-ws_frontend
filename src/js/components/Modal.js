import { createElementFromHTML } from "../utils";

export default class Modal {
  addModal() {
    const modalEl = createElementFromHTML(
      `<div class="modal__background">
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
      </div>`
    );

    document.body.append(modalEl);

    this.formGroup = modalEl.querySelector(".form__group");
    const modalOk = modalEl.querySelector(".modal__ok");
    const modalClose = modalEl.querySelector(".modal__close");
    const formInput = modalEl.querySelector(".form__input");

    const onClose = () => {
      modalEl.remove();
    };

    return { modalOk, modalClose, formInput, onClose };
  }

  addFormHint(message) {
    const newFormHintEl = createElementFromHTML(
      `<div class="form__hint">${message}</div>`
    );
    const formHintEl = this.formGroup.querySelector(".form__hint");
    if (formHintEl) {
      return this.formGroup.replaceChild(newFormHintEl, formHintEl);
    }
    this.formGroup.append(newFormHintEl);
  }
}
