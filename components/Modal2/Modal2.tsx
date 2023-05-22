import React, { Component, FormEvent } from "react";
import styles from "./modal2.module.scss";
import UserNameForm from "./UserNameForm/UserNameForm";

interface ModalState {
  isOpen: boolean;
  context: string;
}

// this is realised as a class component because only class components can have a Ref
// which exposed the components methods to parent components.
// So, with a Ref assigned the Modal can be called inside a function like ModalRef.openModal()

class Modal2 extends Component {
  private resolveModal: ((payload: any) => void) | null = null;
  //its own variable instead of state to avoid rerenders on change

  state: ModalState = {
    isOpen: false,
    context: "",
  };

  openModal = (context: string) => {
    this.setState({ isOpen: true, context: context });
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
    this.setState({ isOpen: false });
    this.resolveModal = null;
  };

  returnResults = (value: any) => {
    if (this.resolveModal) {
      this.resolveModal(value);
      this.closeModal();
    }
  };

  // 1) checks if resolveModal exists, indicating that openModal() was called and a
  // promise is waiting to be resolved.
  // 2) calls the function stored in resolveModal with the current name value.
  // This resolves the promise, passing the submitted name value to the code that is waiting
  // for the promise to be resolved.
  // 3) After resolving, the modal is closed and all states plus resolveModal are reset

  render() {
    return (
      <div
        className={styles.modalBackground}
        onClick={this.closeModal}
        style={this.state.isOpen ? { display: "flex" } : { display: "none" }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {this.state.context === "userNameForm" && <UserNameForm returnResults={this.returnResults} />}

          {this.state.context === "test" && <h1>test</h1>}
        </div>
      </div>
    );
  }
}

export default Modal2;
