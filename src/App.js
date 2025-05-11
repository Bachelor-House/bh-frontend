import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // const baseUrl = 'http://localhost:9999'; 
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([{}]);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file)); // Append all files under 'files'

    try {
      const response = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImage(data.files);
      console.log('Upload response:', data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // Load user data on mount
  useEffect(() => {
    fetch(`${baseUrl}/getuser`)
      .then((res) => res.json())
      .then((data) => {
        setUserDetails(data);
      })
      .catch((err) => console.error('Error loading user:', err));
  }, [baseUrl]);

  const handleUserDetails = (e, key) => {
    setUserDetails({ ...userDetails, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const result = await response.json();
      console.log('Server response:', result);
    } catch (err) {
      console.error('Error submitting user:', err);
    }
  };

  return (
    <div className="App">
      <input type="file" name="files" multiple onChange={handleChange} />
      <br />
      <button type="submit" onClick={handleUpload}>Upload</button>
      <br />

      {image.length > 0 &&
        image.map((file, index) => {
          return (
            <>
              <label>{file.public_id}</label>
              <br />
              <img
                key={index}
                src={file.url}
                alt="preview"
                style={{ width: '150px', margin: '10px' }}
              />
            </>)
        })
      }
      <br />
      <input type='text' name='firstName' value={userDetails.firstName} onChange={(e) => { handleUserDetails(e, 'firstName') }} />
      <br />
      <input type='text' name='lastName' value={userDetails.lastName} onChange={(e) => { handleUserDetails(e, 'lastName') }} />
      <br />
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
