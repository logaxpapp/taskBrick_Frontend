import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export interface SubLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NavLinksProps {
  to?: string;
  label: string;
  icon?: React.ReactNode;
  subLinks?: SubLink[];
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({
  to,
  label,
  icon,
  subLinks,
  isOpen,
  onToggle,
  isCollapsed,
}) => {
  const hasSubLinks = subLinks && subLinks.length > 0;

  // Helper to clone the icon with adjusted size classes.
  const renderIcon = () => {
    if (!icon) return null;
    // Assert that icon is an SVG element so that className can be assigned.
    const iconElement = icon as React.ReactElement<React.SVGProps<SVGSVGElement>>;
    return React.cloneElement(iconElement, {
      className: clsx(iconElement.props.className, isCollapsed ? 'w-7 h-7' : 'w-5 h-5'),
    });
  };

  if (hasSubLinks) {
    return (
      <div className="mt-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center w-full gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-500"
        >
          {renderIcon()}
          {!isCollapsed && <span>{label}</span>}
          {hasSubLinks && !isCollapsed && (
            <svg
              className={clsx(
                'w-4 h-4 ml-auto transform transition-transform',
                isOpen ? 'rotate-90' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
        {isOpen && !isCollapsed && (
          <ul className="pl-8 mt-1 space-y-1">
            {subLinks!.map((subLink, index) => (
              <li key={index}>
                <Link
                  to={subLink.to}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-500"
                >
                  {subLink.icon &&
                    React.cloneElement(
                      subLink.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                      {
                        className: clsx(
                          (subLink.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>)
                            .props.className,
                          isCollapsed ? 'w-7 h-7' : 'w-5 h-5'
                        ),
                      }
                    )}
                  <span>{subLink.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } else {
    return (
      <Link
        to={to!}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
      >
        {renderIcon()}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  }
};

export default NavLinks;
