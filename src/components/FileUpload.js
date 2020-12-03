import React from 'react';
import PropTypes from 'prop-types';

import {Upload, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

/**
 * Get base64 representation of the file
 * @param {object} file File to read
 * @return {any} Base64 file
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Image upload component
 * @component
 */
class FileUpload extends React.Component {
  /**
   * Construct image upload component
   * @param {object} props Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: this.buildFileList(props.initialFiles),
    };
  }

  /**
   * Build an internal file list from external initial files
   * @param {object[]} initialFiles Initial files to display
   * @return {object[]} Built file list
   */
  buildFileList(initialFiles) {
    const fileList = [];
    if (initialFiles && initialFiles.length !== 0) {
      initialFiles.forEach((file, i) => {
        fileList.push({
          url: `${process.env.REACT_APP_API_URL}/${file.fileLocation}`,
          uid: i,
          name: file.type,
          response: file,
          type: file.type,
          status: 'done',
        });
      });
    }
    return fileList;
  }

  /**
   * Upload a file and store the response
   * @param {object} file File to upload
   */
  customFileUpload = async ({onSuccess, onError, file}) => {
    const formData = new FormData();
    formData.append('file', file);

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/files`,
        options,
    );

    if (response.status === 200) {
      onSuccess(await response.json());
    } else {
      onError(response.status);
    }
  }

  /**
   * Hide preview
   */
  handleCancel = () => {
    this.setState({previewVisible: false});
  }

  /**
   * Preview uploaded file
   * @param {object} file Uploaded file
   */
  handlePreview = async (file) => {
    if (file.type.startsWith('image')) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    } else {
      this.setState({
        previewImage: null,
        previewVisible: true,
      });
    }
  };

  /**
   * Change file list
   * @param {object} fileList Object containing the changed file list
   */
  handleChange = ({fileList}) => {
    this.setState({fileList});
    const uploadedFiles = fileList
        .filter((file) => file.status === 'done')
        .map((file) => file.response);
    this.props.setUploadedFiles(uploadedFiles);
  }

  /**
   * Render image upload component
   * @return {JSX.Element}
   */
  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    return (
      <>
        <Upload
          accept="image/*,video/*"
          customRequest={this.customFileUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.resizeImage}
        >
          <div>
            <PlusOutlined />
            <div style={{marginTop: 8}}>Upload</div>
          </div>
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          { previewImage ?
          <img alt="example" style={{width: '100%'}} src={previewImage} /> :
          <p>Cannot preview this file type</p>
          }

        </Modal>
      </>
    );
  }
}

FileUpload.propTypes = {
  /** A method to call with currently uploaded files */
  setUploadedFiles: PropTypes.func.isRequired,
  /** A list of initial files to display */
  initialFiles: PropTypes.array,
};

export default FileUpload;
