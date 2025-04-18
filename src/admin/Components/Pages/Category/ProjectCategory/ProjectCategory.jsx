import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertMessage from "../../../common/MessageSuccesAlert";
import EditCategoryModal from "./EditCategoryModal";
import ProjectAddCategory from "./ProjectAddCategory";
import useProjectCategoryApi from "../../../../hooks/useProjectCategoryApi"; // Adjust the path as needed
import { Row, Col, Alert } from "react-bootstrap";
import AlertSuccesMessage from "../../../common/MessageSuccesAlert";
import Spinner from "react-bootstrap/Spinner";

const ProjectCategory = () => {
  const {
    fetchProjectCategories,
    loading,
    error,
    message,
    setMessage,
    deleteCategory,
    addCategory,
    setError,
    editCategory,
  } = useProjectCategoryApi();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    await addCategory({ name: categoryName, type: "project" });
    setCategoryName(""); // Clear input field
    loadCategories();
    setTimeout(() => {
      setMessage(""); // Clear success message after 3 seconds
      setError(null); // Clear error message if present
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      handleAddCategory(); // Optionally trigger submit on Enter
    }
  };
  const loadCategories = async () => {
    try {
      const response = await fetchProjectCategories();
      if (response && Array.isArray(response.data)) {
        const formattedCategories = response.data.map((item) => ({
          id: item._id,
          category: item.name || "Unnamed",
        }));
        setItems(formattedCategories.reverse());
      } else {
        console.error("Invalid data format:", response);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    loadCategories();
  }, []); // Only on mount

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const handleSave = async (updatedItem) => {
    await editCategory(updatedItem);
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? items.map((item) => item.id) : []);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length > 0) {
      try {
        await deleteCategory(selectedItems); // Call API to delete categories

        // Update local state after successful deletion
        setItems((prevItems) =>
          prevItems.filter((item) => !selectedItems.includes(item.id))
        );

        setMessage(`${selectedItems.length} item(s) removed successfully.`);
        setSelectedItems([]);
      } catch (error) {
        setMessage("Failed to remove selected items.");
      }
    } else {
      setMessage("No items selected to remove.");
    }
  };

  return (
    <div className="container" style={{ padding: "0" }}>
      {/* Header Section */}
      <div
        className="d-flex justify-content-between align-items-center p-4"
        style={{ backgroundColor: "white", minHeight: "85px", padding: "0" }}
      >
        <h4
          className="d-flex align-items-center mb-0 m-0"
          style={{ fontSize: "20px" }}
        >
          <Nav.Link as={Link} to="/admin" className="me-2 opacity-50">
            Home
          </Nav.Link>
          <span> &gt; </span>
          <span className="ms-2">Categories/ Projects</span>
        </h4>
      </div>

      {/* Add Category Section */}
      <div className="my-3 bg-white px-3 py-2 mx-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4
            style={{
              fontSize: "20px",
              color: "#4C6559",
              fontWeight: 500,
              padding: "10px",
            }}
          >
            Add Category
          </h4>
          <i
            className={`bi ${
              showCategoryTabs ? "bi-dash-circle" : "bi-plus-circle"
            }`}
            style={{ color: "#4C6559", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setShowCategoryTabs(!showCategoryTabs)}
          ></i>
        </div>
        {showCategoryTabs && (
          <div
            className="container px-4 py-4"
            style={{ maxWidth: "100%", paddingLeft: "0" }}
          >
            <Form style={{ maxWidth: "600px", marginLeft: "0" }}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Row
                className="mb-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Col md="auto">
                  <Form.Group controlId="subCategoryInput">
                    <Form.Label
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#474747",
                        opacity: "0.8",
                      }}
                    >
                      New Category Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{ width: "281px" }}
                    />
                  </Form.Group>
                </Col>
                <Col md="auto" className="d-flex justify-content-start">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleAddCategory}
                    style={{
                      height: "38px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      marginTop: "30px",
                      backgroundColor: "#9A715B",
                      border: "none",
                      outline: "none",
                      boxShadow: "none", // Removes Bootstrap's default focus shadow
                      border: "none"
                    }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Success Message */}
            {message && <AlertSuccesMessage message={message} />}
          </div>
        )}
      </div>

      {/* Category Table */}
      <div className="my-3 px-3 mx-4">
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              marginTop: "15%",
              width: "100%", // Ensures it takes up full width of the container
              width: "100%", // Full width
            }}
          >
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th style={{ width: "7%", paddingLeft: "12px" }}>
                  <Form.Check type="checkbox" onChange={handleSelectAll} />
                </th>
                <th style={{ width: "80%", fontWeight: 500, fontSize: "16px" }}>
                  Category
                </th>
                <th style={{ width: "23%" }}></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td>{item?.category}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(item)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#9A715B",
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                      <span> Edit </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Edit Modal */}
      {currentItem && (
        <EditCategoryModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          categoryData={currentItem}
          onSave={handleSave}
        />
      )}

      {/* Alert Message */}
      <AlertMessage message={message} />

      {/* Footer Action */}
      {selectedItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "80%",
            backgroundColor: "#f8f9fa",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ddd",
          }}
        >
          <span style={{ color: "#4C6559", fontWeight: 500, fontSize: "18px" }}>
            {selectedItems.length} Selected
          </span>
          <Button
            onClick={handleRemoveSelected}
            style={{
              backgroundColor: "rgba(194, 0, 0, 0.6)",
              border: "none",
              color: "#fff",
            }}
          >
            <i className="bi bi-trash" style={{ marginRight: "5px" }}></i>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectCategory;
