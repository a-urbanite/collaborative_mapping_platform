import React, {FormEvent} from "react";
import styles from './userNameForm.module.scss'

const UserNameForm = ({returnResults} : any) => {
  
  const [name, setname] = React.useState("")
  
    React.useEffect(() => {
      console.log("name: ", name)
    }, [name])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    returnResults(name)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setname(event.target.value);
  };

  return (
    <>
      <h1 className={styles.contentTitle}>Tell us your name, maybe?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default UserNameForm;
