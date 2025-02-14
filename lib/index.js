/*  */
import React from 'react';
import {
  findNodeHandle,
  UIManager,
  Platform,
  NativeModules,
} from 'react-native';


import RNPDFView from './RNPDFView';



class PDFView extends React.Component {
  // eslint-disable-next-line react/sort-comp


  static defaultProps = {
    onError: () => {},
    onLoad: () => {},
    onPageChanged: () => {},
    onScrolled: () => {},
    fadeInDuration: 0.0,
    resourceType: 'url',
    textEncoding: 'utf-8',
    urlProps: {},
  };


  onError = (event) => {
    const { nativeEvent } = event || {};
    // $FlowFixMe: defined in defaultProps
    this.props.onError(nativeEvent || new Error('unknown error'));
  }


  onPageChanged = (event) => {
    const { nativeEvent = {} } = event || {};
    const { page = -1, pageCount = -1 } = nativeEvent;
    // $FlowFixMe: defined in defaultProps
    this.props.onPageChanged(page, pageCount);
  }


  onScrolled = (event) => {
    const { nativeEvent = {} } = event || {};
    const { offset = -1 } = nativeEvent;
    // $FlowFixMe: defined in defaultProps
    this.props.onScrolled(offset);
  }


  _getCommands = () => {
    const _PDFView = UIManager.getViewManagerConfig
      ? UIManager.getViewManagerConfig('PDFView') // RN 0.58
      : (UIManager).PDFView; // RN 0.57
    return _PDFView.Commands;
  }


  _setViewRef = (ref) => {
    this._viewerRef = ref;
  }


  /**
   * A Function. Invoke it when PDF document needs to be reloaded. Use `ref` to
   * access it. Throws an exception in case of errors
   */
  async reload() {
    if (this._viewerRef) {
      const handle = findNodeHandle(this._viewerRef);

      if (!handle) {
        throw new Error('Cannot find node handles');
      }

      await Platform.select({
        android: async () => UIManager.dispatchViewManagerCommand(
          handle,
          this._getCommands().reload,
          [],
        ),
        ios: async () => NativeModules.PDFView.reload(handle),
      })();
    } else {
      throw new Error('No ref to PDFView component, check that component is mounted');
    }
  }


  render() {
    const {
      onError,
      onPageChanged,
      onScrolled,
      ...remainingProps
    } = this.props;
    return (
      <RNPDFView
        ref={this._setViewRef}
        {...remainingProps}
        onError={this.onError}
        onPageChanged={this.onPageChanged}
        onScrolled={this.onScrolled}
      />
    );
  }
}


export default PDFView;
