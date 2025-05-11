import { useState } from 'react';
import './App.css';

function App() {
  // const baseUrl = 'http://localhost:9999'; 
  const baseUrl =process.env.REACT_APP_API_BASE_URL;

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([{}]);

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
console.log(image)
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
              <br/>
              <img
                key={index}
                src={file.url}
                alt="preview"
                style={{ width: '150px', margin: '10px' }}
              />
            </>)
        })
      }
    </div>
  );
}

export default App;
