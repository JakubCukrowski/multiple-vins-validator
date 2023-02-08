// import React, { useState } from 'react';
// import Table from 'react-bootstrap/Table';
// import { useCSVReader } from 'react-papaparse';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles.css'


// const styles = {
//   csvReader: {
//     display: 'flex',
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   browseFile: {
//     width: '20%',
//   },
//   acceptedFile: {
//     border: '1px solid #ccc',
//     height: 45,
//     lineHeight: 2.5,
//     paddingLeft: 10,
//     width: '80%',
//   },
//   remove: {
//     borderRadius: 0,
//     padding: '0 20px',
//   },
//   progressBarBackgroundColor: {
//     backgroundColor: 'red',
//   },
// };

// export default function CSVReader() {
//   const { CSVReader } = useCSVReader();
//   const [data, setData] = useState([])
//   const [header, setHeader] = useState([])
//   const [upload, setUpload] = useState(false)

//   const emailIndex = header.indexOf("Email Address")
//   const vinIndex = header.indexOf("VIN")
//   const deleteWhiteSpace = /\s+/g
//   const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g

//   const multipliersForUSA = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
//   const multipliersForEurope = [9, 8,	7, 6,	5, 4,	3, 2,	10,	9, 8,	7, 6,	5, 4, 3, 2]
//   const lettersValue = {
//     A: 1, B: 2, C: 3, D: 4, E: 5,
//     F: 6, G: 7, H: 8, J: 1, K: 2,
//     L: 3, M: 4, N: 5, P: 7, R: 9,
//     S: 2, T: 3, U: 4, V: 5, W: 6,
//     X: 7, Y: 8, Z: 9
//   }

//   const transformLettersToNumbers = (vin) => {
//     const numericValues = []
//     for (let i = 0; i < vin.length; i++) {
//       if (Object.keys(lettersValue).includes(vin[i])) {
//         numericValues.push(lettersValue[vin[i]])
//       } else {
//         numericValues.push(Number(vin[i]))
//       }
//     }
//     return numericValues
//   }

//   const multiplyArrayValuesForUSA = (numericValues) => {
//     const numericValuesMultiplied = []
//     for (let i = 0; i < multipliersForUSA.length; i++) {
//       numericValuesMultiplied.push(numericValues[i] * multipliersForUSA[i])
//     }
//     return numericValuesMultiplied
//   }

//   const multiplyArrayValuesForEurope = (numericValues) => {
//     const numericValuesMultiplied = []
//     for (let i = 0; i < multipliersForEurope.length; i++) {
//       numericValuesMultiplied.push(numericValues[i] * multipliersForEurope[i])
//     }
//     return numericValuesMultiplied
//   }

//   const checkNumber = (numericValuesMultiplied) => {
//     const sumArray = numericValuesMultiplied.reduce((num, acc) => num + acc)
//     return sumArray % 11
//   }

//   const checkIfValid = (vin) => {
//     const lettersToNumbers = transformLettersToNumbers(vin)
//     const multiplyUSA = multiplyArrayValuesForUSA(lettersToNumbers)
//     const multiplyEurope = multiplyArrayValuesForEurope(lettersToNumbers)
//     const checkDigitUSA = checkNumber(multiplyUSA)
//     const checkDigitEurope = checkNumber(multiplyEurope)

//     if (checkDigitUSA === Number(vin[8]) || (checkDigitUSA === 10 && vin[8] === "X")) {
//       return <td style={{color: 'green', fontWeight: 'bold'}}>Valid</td>

//     } else if (checkDigitEurope === Number(vin[8]) || (checkDigitEurope === 10 && vin[8] === "X")) {
//       return <td style={{color: 'green', fontWeight: 'bold'}}>Valid for Europe</td>

//     } else if (vin.length < 17) {
//       return <td style={{color: 'orangered', fontWeight: 'bold'}}>VIN might be too short to validate</td>

//     } else {
//       return <td style={{color: "red", fontWeight: 'bold'}}>Invalid</td>
//     }
//   }

//   return (
//     <>
//     <CSVReader
//       onUploadAccepted={(result) => {
//         setUpload(true)
//         setHeader(result.data[0])
//         setData(result.data.slice(1, result.data.length))
//       }}
//     >
//       {({
//         getRootProps,
//         acceptedFile,
//         ProgressBar,
//         getRemoveFileProps,
//       }) => (
//         <>
//           <div style={styles.csvReader}>
//             <button type='button' {...getRootProps()} style={styles.browseFile}>
//               Browse file
//             </button>
//             <div style={styles.acceptedFile}>
//               {acceptedFile && acceptedFile.name}
//             </div>
//             <button {...getRemoveFileProps()} style={styles.remove}>
//               Remove
//             </button>
//           </div>
//           <ProgressBar style={styles.progressBarBackgroundColor} />
//         </>
//       )}
//     </CSVReader>
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           {upload === true ? <><th>{header[emailIndex]}</th>
//           <th>{header[vinIndex]}</th>
//           <th>Valid?</th>
//           </> : null}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((file, index) => {
//           return (
//             <tr key={index}>
//               {file[vinIndex] !== "" && file[vinIndex] !== "" && file.length > 1 && file[vinIndex].length <= 40 ? 
//               <>
//               <td>{file[emailIndex]}</td>
//               <td>{file[vinIndex]
//                 .toUpperCase()
//                 .replace(deleteWhiteSpace, "")
//                 .replace(specialCharacters, "")
//                 .replace(/I/g, "1")
//                 .replace(/O/g, "0")}</td>
//               {checkIfValid(file[vinIndex]
//                 .toUpperCase()
//                 .replace(deleteWhiteSpace, "")
//                 .replace(specialCharacters, "")
//                 .replace(/I/g, "1")
//                 .replace(/O/g, "0"))}
//               </> : null}
//             </tr>
//           )
//         })}
//       </tbody>
//     </Table>
//     </>
//   );
// }





















import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useCSVReader } from 'react-papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from 'react-csv';
import './styles.css'


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
      return "Valid for Europe"

    } else if (vin.length < 17) {
      return "VIN might be too short to validate or it's not a vin"

    } else {
      return "Invalid"
    }
  }

  return (
    <>
    <CSVReader
      onUploadAccepted={(result) => {
        const emailIndex = result.data[0].indexOf("Email Address")
        const vinIndex = result.data[0].indexOf("VIN")
        setUpload(true)
        setHeaders(prev => [...prev, {
          email: result.data[0][emailIndex], key: "email"
        }, {
          vin: result.data[0][vinIndex], key: "vin"}, {
            isValid: "Valid?", key: "valid"
          }])
        result.data.slice(1, result.data.length)
        .filter(file => file[vinIndex] !== "")
        .filter(file => file[emailIndex] !== "")
        .filter(file => file[vinIndex].length <= 30)
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
      
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }) => (
        <>
          <div style={styles.csvReader}>
            <button type='button' {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
    <Table striped bordered hover>
      <thead>
        {upload === true ? 
        <tr>
          <th>{headers[0].email}</th>
          <th>{headers[1].vin}</th>
          <th>{headers[2].isValid}</th>
        </tr> : null}
      </thead>
      <tbody>
        {data.map((file, index) => 
          <tr key={index}>
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
    </Table>
    {upload === true ? <CSVLink data={data} headers={headers}>
      Download me
    </CSVLink> : null}
    </>
  );
}