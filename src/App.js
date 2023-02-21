import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useCSVReader } from 'react-papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from 'react-csv';
import './styles.css'
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  browseFile: {
    width: '20%',
  },
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  },
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const [headers, setHeaders] = useState([])
  const [data, setData] = useState([])
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(500)
  const [filteredData, setFilteredData] = useState([])
  const location = useLocation()

  const lastPostIndex = currentPage * postPerPage
  const firstPostIndex = lastPostIndex - postPerPage

  const pages = []
  for (let i = 1; i <= Math.ceil(filteredData.length / postPerPage); i++) {
    pages.push(i)
  }

  const deleteWhiteSpace = /\s+/g
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g

  const multipliersForUSA = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
  const multipliersForEurope = [9, 8, 7, 6,	5, 4, 3, 2,	10,	9, 8, 7, 6,	5, 4, 3, 2]
  const lettersValue = {
    A: 1, B: 2, C: 3, D: 4, E: 5,
    F: 6, G: 7, H: 8, J: 1, K: 2,
    L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6,
    X: 7, Y: 8, Z: 9
  }

  const transformLettersToNumbers = (vin) => {
    const numericValues = []
    for (let i = 0; i < vin.length; i++) {
      if (Object.keys(lettersValue).includes(vin[i])) {
        numericValues.push(lettersValue[vin[i]])
      } else {
        numericValues.push(Number(vin[i]))
      }
    }
    return numericValues
  }

  const multiplyArrayValuesForUSA = (numericValues) => {
    const numericValuesMultiplied = []
    for (let i = 0; i < multipliersForUSA.length; i++) {
      numericValuesMultiplied.push(numericValues[i] * multipliersForUSA[i])
    }
    return numericValuesMultiplied
  }

  const multiplyArrayValuesForEurope = (numericValues) => {
    const numericValuesMultiplied = []
    for (let i = 0; i < multipliersForEurope.length; i++) {
      numericValuesMultiplied.push(numericValues[i] * multipliersForEurope[i])
    }
    return numericValuesMultiplied
  }

  const checkNumber = (numericValuesMultiplied) => {
    const sumArray = numericValuesMultiplied.reduce((num, acc) => num + acc)
    return sumArray % 11
  }

  const checkIfValid = (vin) => {
    const lettersToNumbers = transformLettersToNumbers(vin)
    const multiplyUSA = multiplyArrayValuesForUSA(lettersToNumbers)
    const multiplyEurope = multiplyArrayValuesForEurope(lettersToNumbers)
    const checkDigitUSA = checkNumber(multiplyUSA)
    const checkDigitEurope = checkNumber(multiplyEurope)

    if (checkDigitUSA === Number(vin[8]) || (checkDigitUSA === 10 && vin[8] === "X")) {
      return "Valid"

    } else if (checkDigitEurope === Number(vin[8]) || (checkDigitEurope === 10 && vin[8] === "X")) {
      return "Valid"

    } else if (vin.length < 17) {
      return "VIN might be too short to validate or it's not a vin"

    } else {
      return "Invalid"
    }
  }

  useEffect(() => {
    if (data.length !== 0) {
      setIsVisible(true)
      setLoading(true)
      setFilteredData(data)
    }
  }, [data])

  useEffect(() => {
    if (data.length !== 0) {
      const newUrl = `${location.pathname}?page=${currentPage}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [data, location, currentPage])

  const handleShowValid = () => {
    setFilteredData(data.filter(vin => vin.valid === "Valid"))
    setCurrentPage(1)
  }

  const handleShowInvalid = () => {
    setFilteredData(data.filter(vin => vin.valid === "Invalid"))
    setCurrentPage(1)
  }

  const handleShowAll = () => {
    setFilteredData(data)
    setCurrentPage(1)
  }

  const handleShowOther = () => {
    setFilteredData(data.filter(vin => vin.valid === "VIN might be too short to validate or it's not a vin"))
    setCurrentPage(1)
  }

  return (
    <>
    <CSVReader
      onUploadAccepted={(result) => {
        setData([])
        setLoading(false)
        const emailIndex = result.data[0].indexOf("Email Address")
        const vinIndex = result.data[0].indexOf("VIN")
        setHeaders([{
          label: result.data[0][emailIndex], 
          key: "email"
        }, {
          label: result.data[0][vinIndex], 
          key: "vin"
        }, {
            label: "Valid?",
            key: "valid"
          }])
        result.data.slice(1, result.data.length)
        .filter(file => file[vinIndex] !== "")
        .filter(file => file[emailIndex] !== "")
        .filter(file => file[vinIndex].length <= 30)
        .filter(file => file[vinIndex] !== "kt33030" && "KT33030")
        .forEach(file => setData(prev => [...prev, {
          email: file[emailIndex],
          vin: file[vinIndex]
            .toUpperCase()
            .replace(deleteWhiteSpace, "")
            .replace(specialCharacters, "")
            .replace(/I/g, "1")
            .replace(/O/g, "0"),
          valid: checkIfValid(file[vinIndex]
            .toUpperCase()
            .replace(deleteWhiteSpace, "")
            .replace(specialCharacters, "")
            .replace(/I/g, "1")
            .replace(/O/g, "0"),)  
        }]))
        setUpload(true)
        setIsVisible(false)
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        getRemoveFileProps,
      }) => (
        <>
          <div style={styles.csvReader}>
            <button type='button' {...getRootProps()} style={styles.browseFile}>
              Add file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
        </>
      )}
    </CSVReader>
    {isVisible === true ? 
    <div style={{width: "100%", display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10}}>
    <button onClick={handleShowValid}>
      Show <span style={{color: "green", fontWeight: 'bold'}}>Valid</span> only
    </button>
    <button onClick={handleShowInvalid}>
      Show <span style={{color: 'tomato', fontWeight: 'bold'}}>Invalid</span> only
      </button>
      <button onClick={handleShowOther}>
        Other
      </button>
    <button onClick={handleShowAll}>Show all</button>
  </div> : null}
    {loading === false
    ? <div style={{maxWidth: "100%", minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Spinner style={{width: 60, height: 60}} animation='border'/>
      </div> 
    : <Table striped bordered hover>
    <thead>
      {upload === true ? 
      <tr style={{position: 'sticky', top: "-2px", backgroundColor: 'wheat'}}>
        <th style={{backgroundColor: 'white'}}>#</th>
        <th style={{backgroundColor: 'white'}}>{headers[0].label}</th>
        <th style={{backgroundColor: 'white'}}>{headers[1].label}</th>
        <th style={{backgroundColor: 'white'}}>{headers[2].label}</th>
      </tr> : null}
    </thead>
    <tbody>
      {filteredData.slice(firstPostIndex, lastPostIndex).map((file, index) => 
        <tr key={index}>
        <td>{index + 1 + lastPostIndex - postPerPage}</td>  
        <td>{file.email}</td>
        <td>{file.vin}</td>
        <td style={{fontWeight: "bold", 
        color: file.valid === "Valid" || file.valid === "Valid for Europe" 
        ? "green" : file.valid === "Invalid" ? "red" 
        : "cornflowerblue"}}>
          {file.valid}
          </td>
        </tr>
      )}
    </tbody>
  </Table>}
    {isVisible === true 
    ? <CSVLink 
    data={filteredData} 
    headers={headers} 
    filename="subscribers_vins"
    style={{
      textDecoration: "none", 
      color: 'white', 
      backgroundColor: 'blue', 
      padding: "6px 10px", 
      border: "0.75px solid black",
      position: 'sticky', 
      bottom: 20, 
      left: "90%"}}>
      Download
    </CSVLink> 
    : null}
    <div style={{width: "100%", display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20}}>
    {pages.map((page, index) => {
      return (
        <button className={page === currentPage ? "active" : ""} key={index} onClick={() => setCurrentPage(page)}>{page}</button>
      )
    })}
    </div>
    </>
  );
}
