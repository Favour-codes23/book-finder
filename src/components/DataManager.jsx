import React, { useState } from "react";

function DataManager({ goalBooks, readBooks, currentlyReading, onImportData }) {
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const exportData = () => {
    const exportDate = new Date().toISOString().split('T')[0];
    const data = {
      exportDate,
      version: "1.0",
      goalBooks,
      readBooks,
      currentlyReading,
      totalBooks: goalBooks.length + readBooks.length + currentlyReading.length
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bookish-library-${exportDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const validateImportData = (data) => {
    const errors = [];
    
    if (typeof data !== 'object' || data === null) {
      errors.push("Invalid file format");
      return errors;
    }

    const requiredFields = ['goalBooks', 'readBooks', 'currentlyReading'];
    requiredFields.forEach(field => {
      if (!Array.isArray(data[field])) {
        errors.push(`Missing or invalid ${field} data`);
      }
    });

    // Validate book objects have required fields
    const allBooks = [...(data.goalBooks || []), ...(data.readBooks || []), ...(data.currentlyReading || [])];
    const requiredBookFields = ['id'];
    
    allBooks.forEach((book, index) => {
      if (!book || typeof book !== 'object') {
        errors.push(`Invalid book object at position ${index + 1}`);
        return;
      }
      
      requiredBookFields.forEach(field => {
        if (!book[field]) {
          errors.push(`Book at position ${index + 1} missing required field: ${field}`);
        }
      });
    });

    return errors;
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    setImportError("");
    setImportSuccess("");
    
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError("Please select a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        const validationErrors = validateImportData(importedData);
        if (validationErrors.length > 0) {
          setImportError(`Import failed: ${validationErrors.join(', ')}`);
          return;
        }

        // Show confirmation dialog
        const totalBooks = importedData.totalBooks || 
          (importedData.goalBooks.length + importedData.readBooks.length + importedData.currentlyReading.length);
        
        const confirmMessage = `This will replace all your current data with:
- ${importedData.goalBooks.length} books in To Be Read
- ${importedData.currentlyReading.length} currently reading books  
- ${importedData.readBooks.length} finished books
- Total: ${totalBooks} books

Are you sure you want to continue?`;

        if (window.confirm(confirmMessage)) {
          onImportData(importedData);
          setImportSuccess(`Successfully imported ${totalBooks} books!`);
        }
      } catch (error) {
        setImportError("Invalid JSON file or corrupted data");
      }
    };

    reader.onerror = () => {
      setImportError("Error reading file");
    };

    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const clearAllData = () => {
    const totalBooks = goalBooks.length + readBooks.length + currentlyReading.length;
    
    if (totalBooks === 0) {
      alert("No data to clear!");
      return;
    }

    const confirmMessage = `This will permanently delete all your data:
- ${goalBooks.length} books in To Be Read
- ${currentlyReading.length} currently reading books
- ${readBooks.length} finished books
- Total: ${totalBooks} books

This action cannot be undone. Are you sure?`;

    if (window.confirm(confirmMessage)) {
      const secondConfirm = window.confirm("Are you absolutely sure? This will delete everything!");
      
      if (secondConfirm) {
        onImportData({
          goalBooks: [],
          readBooks: [],
          currentlyReading: []
        });
        setImportSuccess("All data cleared successfully");
      }
    }
  };

  const getTotalBooks = () => goalBooks.length + readBooks.length + currentlyReading.length;

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "12px", color: "#3a2f1f" }}>
        Data Management
      </h2>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        
        {/* Current Data Summary */}
        <div style={{
          backgroundColor: "#fefcf7",
          border: "1px solid #e8dcc0",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.2rem", 
            fontWeight: "600", 
            color: "#3a2f1f", 
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📊 Your Library Summary
          </h3>
          <div style={{ fontSize: "0.95rem", color: "#5d4e37" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Books to be read:</span>
              <span style={{ fontWeight: "600" }}>{goalBooks.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Currently reading:</span>
              <span style={{ fontWeight: "600" }}>{currentlyReading.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Finished books:</span>
              <span style={{ fontWeight: "600" }}>{readBooks.length}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #f0ebe0",
              fontSize: "1.1rem"
            }}>
              <span style={{ fontWeight: "600" }}>Total books:</span>
              <span style={{ fontWeight: "700", color: "#3a2f1f" }}>{getTotalBooks()}</span>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div style={{
          backgroundColor: "#fefcf7",
          border: "1px solid #e8dcc0",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.2rem", 
            fontWeight: "600", 
            color: "#3a2f1f", 
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📥 Export Your Data
          </h3>
          <p style={{ color: "#5d4e37", marginBottom: "16px", lineHeight: "1.4" }}>
            Download a backup of all your books, ratings, and progress. This file can be used to restore your data later or transfer it to another device.
          </p>
          <button
            onClick={exportData}
            className="btn"
            disabled={getTotalBooks() === 0}
            style={getTotalBooks() === 0 ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          >
            📥 Export Library Data
          </button>
          {getTotalBooks() === 0 && (
            <p style={{ fontSize: "0.8rem", color: "#8b7355", marginTop: "8px" }}>
              No data to export. Add some books first!
            </p>
          )}
        </div>

        {/* Import Section */}
        <div style={{
          backgroundColor: "#fefcf7",
          border: "1px solid #e8dcc0",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.2rem", 
            fontWeight: "600", 
            color: "#3a2f1f", 
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📤 Import Data
          </h3>
          <p style={{ color: "#5d4e37", marginBottom: "16px", lineHeight: "1.4" }}>
            Restore your library from a previously exported file. This will replace all your current data.
          </p>
          
          <div style={{ marginBottom: "12px" }}>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
              id="import-file"
            />
            <label 
              htmlFor="import-file" 
              className="btn btn-secondary"
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              📤 Choose Import File
            </label>
          </div>

          {importError && (
            <div style={{
              backgroundColor: "#faf2f2",
              border: "1px solid #e8d4d4",
              borderRadius: "6px",
              padding: "8px 12px",
              color: "#8b4142",
              fontSize: "0.9rem",
              marginTop: "8px"
            }}>
              ❌ {importError}
            </div>
          )}

          {importSuccess && (
            <div style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "6px",
              padding: "8px 12px",
              color: "#059669",
              fontSize: "0.9rem",
              marginTop: "8px"
            }}>
              ✅ {importSuccess}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div style={{
          backgroundColor: "#faf2f2",
          border: "1px solid #e8d4d4",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.2rem", 
            fontWeight: "600", 
            color: "#8b4142", 
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ⚠️ Danger Zone
          </h3>
          <p style={{ color: "#8b4142", marginBottom: "16px", lineHeight: "1.4" }}>
            Permanently delete all your data. This action cannot be undone!
          </p>
          <button
            onClick={clearAllData}
            className="btn btn-danger"
            disabled={getTotalBooks() === 0}
            style={getTotalBooks() === 0 ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          >
            🗑️ Clear All Data
          </button>
          {getTotalBooks() === 0 && (
            <p style={{ fontSize: "0.8rem", color: "#8b7355", marginTop: "8px" }}>
              No data to clear.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataManager;