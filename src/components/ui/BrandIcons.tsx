import type { IconBaseProps } from 'react-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';

export function Github(props: IconBaseProps) {
  return <FaGithub aria-hidden="true" {...props} />;
}

export function Linkedin(props: IconBaseProps) {
  return <FaLinkedin aria-hidden="true" {...props} />;
}
