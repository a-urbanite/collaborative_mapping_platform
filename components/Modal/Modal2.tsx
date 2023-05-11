import React, { Component, FormEvent } from 'react';

interface ModalProps {
  // closeModal: () => void;
  // setHandleModalSubmit: (fn: (name: string) => void) => void;
}

interface ModalState {
  isOpen: boolean;
  name: string;
}

class Modal extends Component<ModalProps, ModalState> {
  private resolveModal: ((name: string) => void) | null = null;

  constructor(props: ModalProps) {
    super(props);
    this.state = {
      isOpen: false,
      name: '',
    };
  }

  openModal = () => {
    this.setState({ isOpen: true });
    return new Promise<string>((resolve) => {
      this.resolveModal = resolve;
    });
  };

  closeModal = () => {
    this.setState({ isOpen: false, name: '' });
    this.resolveModal = null;
    // this.props.closeModal();
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { name } = this.state;
    if (this.resolveModal) {
      this.resolveModal(name);
      this.closeModal();
    }
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  render() {
    const { isOpen, name } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <div>
        <div className="modal-overlay" onClick={this.closeModal} />
        <div className="modal">
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

export default Modal;
