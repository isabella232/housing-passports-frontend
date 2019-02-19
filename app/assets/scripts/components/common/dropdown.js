'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import TetherComponent from 'react-tether';
import { CSSTransition } from 'react-transition-group';
import styled, { css } from 'styled-components';

import { divide, multiply } from '../../atomic-components/utils/math';
import { themeVal } from '../../atomic-components/utils/functions';
import { rgba } from 'polished';

let activeDropdowns = [];

/*
<Dropdown
  className='browse-menu'
  triggerElement={<button>Hello</button>}
  direction='down'
  alignment='center' >

  <h6 className='drop__title'>Browse</h6>
  <ul className='drop__menu drop__menu--select'>
    <li><Link to='' className='drop__menu-item' activeClassName='drop__menu-item--active'>Label</Link></li>
  </ul>

</Dropdown>
*/

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props);

    this.uuid = Math.random().toString(36).substr(2, 5);

    this.state = {
      open: false
    };

    this._bodyListener = this._bodyListener.bind(this);
    this._toggleDropdown = this._toggleDropdown.bind(this);
  }

  static closeAll () {
    activeDropdowns.forEach(d => d.close());
  }

  _bodyListener (e) {
    const attrHook = (el) => el.getAttribute ? el.getAttribute('data-hook') : null;
    // Get the dropdown that is a parent of the clicked element. If any.
    let theSelf = e.target;
    if (theSelf.tagName === 'BODY' ||
        theSelf.tagName === 'HTML' ||
        attrHook(theSelf) === 'dropdown:close') {
      this.close();
      return;
    }

    const getClosestInstance = (el) => {
      do {
        // If the click is released outside the view port, the el will be
        // HTMLDocument and won't have hasAttribute method.
        if (el && el.hasAttribute && el.hasAttribute('data-drop-instance')) {
          return el;
        }
        el = el.parentNode;
      } while (el && el.tagName !== 'BODY' && el.tagName !== 'HTML');

      return null;
    };

    // The closest instance is the closest parent element with a
    // data-drop-instance. It also has a data-drop-el which can be trigger
    // or content. Depending on this we know if we're handling a trigger click
    // or a click somewhere else.
    const closestInstance = getClosestInstance(theSelf);
    if (!closestInstance) return this.close();

    const uuid = closestInstance.getAttribute('data-drop-instance');
    if (closestInstance.getAttribute('data-drop-el') === 'trigger' && uuid === this.uuid) {
      // If we're dealing with the trigger for this instance don't do anything.
      // There are other listeners in place.
      return;
    }

    if (closestInstance.getAttribute('data-drop-el') === 'content' && uuid === this.uuid) {
      // If we're dealing with the content for this instance don't do anything.
      // The content elements can use data-hook='dropdown:close' if they need to
      // close the dropdown, otherwise a trigger click is needed.
      return;
    }

    // In all other cases close the dropdown.
    this.close();
  }

  _toggleDropdown (e) {
    e.preventDefault();
    this.toggle();
  }

  // Lifecycle method.
  // Called once as soon as the component has a DOM representation.
  componentDidMount () {
    activeDropdowns.push(this);
    window.addEventListener('click', this._bodyListener);
  }

  // Lifecycle method.
  componentWillUnmount () {
    activeDropdowns.splice(activeDropdowns.indexOf(this), 1);
    window.removeEventListener('click', this._bodyListener);
  }

  toggle () {
    this.setState({ open: !this.state.open });
  }

  open () {
    !this.state.open && this.setState({ open: true });
  }

  close () {
    this.state.open && this.setState({ open: false });
  }

  renderTriggerElement () {
    const {
      triggerElement
    } = this.props;

    return React.cloneElement(triggerElement, {
      onClick: this._toggleDropdown,
      'data-drop-el': 'trigger',
      'data-drop-instance': this.uuid
    });
  }

  renderContent () {
    const { id, direction, className } = this.props;

    // Base and additional classes for the trigger and the content.
    let klasses = ['drop__content', 'drop-trans', `drop-trans--${direction}`];
    let dropdownContentProps = {
      'data-drop-instance': this.uuid,
      'data-drop-el': 'content'
    };

    if (className) {
      klasses.push(className);
    }

    dropdownContentProps.direction = direction;
    dropdownContentProps.className = klasses.join(' ');

    if (id) {
      dropdownContentProps.id = id;
    }

    return (
      <CSSTransition
        in={this.state.open}
        appear={true}
        unmountOnExit={true}
        classNames='drop-trans'
        timeout={{ enter: 300, exit: 300 }}>

        <TransitionItem
          props={dropdownContentProps}
          onChange={this.props.onChange} >
          { this.props.children }
        </TransitionItem>

      </CSSTransition>
    );
  }

  render () {
    let { alignment, direction } = this.props;

    let allowed;
    if (direction === 'up' || direction === 'down') {
      allowed = ['left', 'center', 'right'];
    } else if (direction === 'left' || direction === 'right') {
      allowed = ['top', 'middle', 'bottom'];
    } else {
      throw new Error(`Dropdown: direction "${direction}" is not supported. Use one of: up, down, left, right`);
    }

    if (allowed.indexOf(alignment) === -1) {
      throw new Error(`Dropdown: alignment "${alignment}" is not supported when direction is ${direction}. Use one of: ${allowed.join(', ')}`);
    }

    let tetherAttachment;
    let tetherTargetAttachment;
    switch (direction) {
      case 'up':
        tetherAttachment = `bottom ${alignment}`;
        tetherTargetAttachment = `top ${alignment}`;
        break;
      case 'down':
        tetherAttachment = `top ${alignment}`;
        tetherTargetAttachment = `bottom ${alignment}`;
        break;
      case 'right':
        tetherAttachment = `${alignment} left`;
        tetherTargetAttachment = `${alignment} right`;
        break;
      case 'left':
        tetherAttachment = `${alignment} right`;
        tetherTargetAttachment = `${alignment} left`;
        break;
    }

    // attachment={tetherAttachment}
    // targetAttachment={tetherTargetAttachment}
    return (
      <TetherComponent
        // attachment is the content.
        attachment={tetherAttachment}
        // targetAttachment is the trigger
        targetAttachment={tetherTargetAttachment}
        constraints={[{
          to: 'window',
          attachment: 'together'
        }]}>
        {this.renderTriggerElement()}
        {this.renderContent()}
      </TetherComponent>
    );
  }
}

Dropdown.defaultProps = {
  triggerElement: 'button',
  direction: 'down',
  alignment: 'center'
};

if (process.env.NODE_ENV !== 'production') {
  Dropdown.propTypes = {
    id: T.string,
    onChange: T.func,

    triggerElement: T.node,

    direction: T.oneOf(['up', 'down', 'left', 'right']),
    alignment: T.oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),

    className: T.string,
    children: T.node
  };
}

const transitions = {
  up: {
    start: () => css`
      opacity: 0;
      transform: translate(0, ${themeVal('layout.globalSpacing')});
    `,
    end: () => css`
      opacity: 1;
      transform: translate(0, -${themeVal('layout.globalSpacing')});
    `
  },
  down: {
    start: () => css`
      opacity: 0;
      transform: translate(0, -${themeVal('layout.globalSpacing')});
    `,
    end: () => css`
      opacity: 1;
      transform: translate(0, ${themeVal('layout.globalSpacing')});
    `
  },
  left: {
    start: () => css`
      opacity: 0;
      transform: translate(${themeVal('layout.globalSpacing')}, 0);
    `,
    end: () => css`
      opacity: 1;
      transform: translate(-${themeVal('layout.globalSpacing')}, 0);
    `
  },
  right: {
    start: () => css`
      opacity: 0;
      transform: translate(-${themeVal('layout.globalSpacing')}, 0);
    `,
    end: () => css`
      opacity: 1;
      transform: translate(${themeVal('layout.globalSpacing')}, 0);
    `
  }
};

const DropContent = styled.div`
  background: #fff;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: 0 0 0 ${divide(themeVal('shape.borderWidth'), 2)} ${({ theme }) => rgba(theme.colors.baseColor, 0.08)}, ${multiply(themeVal('shape.borderWidth'), 2)} ${multiply(themeVal('shape.borderWidth'), 2)} 0 ${({ theme }) => rgba(theme.colors.baseColor, 0.06)};
  position: relative;
  z-index: 1000;
  width: 100%;
  max-width: 14rem;
  margin: 0;
  padding: ${themeVal('layout.globalSpacing')};
  overflow: hidden;
  text-align: left;
  color: ${themeVal('typography.baseFontColor')};
  font-size: 1rem;
  line-height: 1.5;
  transition: opacity 0.16s ease, transform 0.16s ease;
  ${({ direction }) => transitions[direction].end};

  &.drop-trans-appear,
  &.drop-trans-enter {
    ${({ direction }) => transitions[direction].start};
  }

  &&.drop-trans-enter-active,
  &&.drop-trans-appear-active {
    ${({ direction }) => transitions[direction].end};
  }

  &.drop-trans-exit {
    ${({ direction }) => transitions[direction].end};
  }

  &&.drop-trans-exit-active {
    ${({ direction }) => transitions[direction].start};
  }
`;

class TransitionItem extends React.Component {
  componentDidMount () {
    this.props.onChange && this.props.onChange(true);
  }

  componentWillUnmount () {
    this.props.onChange && this.props.onChange(false);
  }

  render () {
    return <DropContent {...this.props.props}>{ this.props.children }</DropContent>;
  }
}

if (process.env.NODE_ENV !== 'production') {
  TransitionItem.propTypes = {
    onChange: T.func,
    props: T.object,
    children: T.node
  };
}
