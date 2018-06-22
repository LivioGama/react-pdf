import Base from './Base';

class View extends Base {
  static defaultProps = {
    style: {},
  };

  constructor(root, props) {
    super(root, props);
    this.canBeSplitted = true;
  }

  async render(page) {
    this.drawBackgroundColor();
    this.drawBorders();

    if (this.props.debug) {
      this.debug();
    }

    await this.renderChildren(page);
  }
}

export default View;
