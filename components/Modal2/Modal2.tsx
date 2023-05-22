import React, { Component, FormEvent } from "react";
import styles from "./modal2.module.scss";

interface ModalState {
  isOpen: boolean;
  name: string;
}

// this is realised as a class component because only class components can have a Ref
// which exposed the components methods to parent components. 
// So, with a Ref assigned the Modal can be called inside a function like ModalRef.openModal()

class Modal2 extends Component {

  private resolveModal: ((name: string) => void) | null = null;
  //its own variable instead of state to avoid rerenders on change

  state: ModalState = {
    isOpen: false,
    name: "",
  };

  openModal = () => {
    this.setState({ isOpen: true });
    return new Promise<string>((resolve) => {
      this.resolveModal = resolve;
    });
  };

  // 1) sets the isOpen state to true, which triggers the rendering of the modal.
  // 2) returns a new promise which allows the parent component or any other code
  // that calls openModal() can wait for the promise to be resolved before proceeding.
  // 3) this promise's resolve function is stored in the private resolveModal variable.
  // When resolveModal() is called later on the promise will resolve with the submitted name value.

  closeModal = () => {
    this.setState({ isOpen: false, name: "" });
    this.resolveModal = null;
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { name } = this.state;
    if (this.resolveModal) {
      this.resolveModal(name);
      this.closeModal();
    }
  };

  // 1) extracts the name from the form submit event object
  // 2) checks if resolveModal exists, indicating that  openModal() was called and a
  // promise is waiting to be resolved.
  // 3) calls the function stored in resolveModal with the current name value.
  // This resolves the promise, passing the submitted name value to the code that is waiting
  // for the promise to be resolved.
  // 4) After resolving, the modal is closed and all states plus resolveModal are reset

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  render() {
    const { isOpen, name } = this.state;

    // if (!isOpen) {
    //   return null;
    // }

    return (
      <div
        className={styles.modalBackground}
        onClick={this.closeModal}
        style={isOpen ? { display: "flex" } : { display: "none" }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h1 className={styles.contentTitle}>Tell us your name, maybe?</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={this.handleNameChange} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Modal2;
