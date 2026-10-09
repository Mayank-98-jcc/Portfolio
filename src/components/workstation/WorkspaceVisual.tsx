export function WorkspaceVisual({ variant = 'desk' }: { variant?: 'desk' | 'code' | 'system' }) {
  if (variant === 'code')
    return (
      <div
        className="workspace-art code-workspace"
        role="img"
        aria-label="Illustration of a code editor, representing the development process"
      >
        <div className="editor-window">
          <div className="editor-top">
            <span>● ● ●</span>
            <span>curiosity.tsx</span>
          </div>
          <div className="editor-code">
            <span className="code-comment">// Small steps. Meaningful progress.</span>
            <br />
            <span className="code-purple">const</span> developer = &#123;
            <br />
            &nbsp; name: <span className="code-green">'Mayank'</span>,<br />
            &nbsp; mindset: <span className="code-green">'always learning'</span>,<br />
            &nbsp; focus: [<span className="code-green">'web'</span>,{' '}
            <span className="code-green">'AI'</span>],
            <br />
            &#125;;
            <br />
            <br />
            <span className="code-purple">while</span> (curious) &#123;
            <br />
            &nbsp; learn();
            <br />
            &nbsp; build();
            <br />
            &nbsp; iterate();
            <br />
            &#125;
          </div>
        </div>
        <span className="workspace-tag">02 — THE PROCESS</span>
      </div>
    );
  if (variant === 'system')
    return (
      <div
        className="workspace-art system-workspace"
        role="img"
        aria-label="Conceptual diagram connecting interface, logic and data"
      >
        <div className="system-orbit orbit-one" />
        <div className="system-orbit orbit-two" />
        <span className="system-node node-one">
          INTERFACE<span>React / TypeScript</span>
        </span>
        <span className="system-node node-two">
          LOGIC<span>Node.js / APIs</span>
        </span>
        <span className="system-node node-three">
          DATA<span>MongoDB / PostgreSQL</span>
        </span>
        <span className="workspace-tag">03 — THE BIGGER PICTURE</span>
      </div>
    );
  return (
    <div
      className="workspace-art desk-workspace"
      role="img"
      aria-label="Illustrated developer desk with monitor, keyboard and plant; a conceptual workspace"
    >
      <div className="desk-light" />
      <div className="desk-window">
        <i />
        <i />
        <i />
      </div>
      <div className="desk-surface" />
      <div className="desk-monitor">
        <div className="monitor-screen">
          <span className="screen-top">hello, world.</span>
          <div className="screen-code">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className="screen-bottom">CREATE SOMETHING MEANINGFUL ↗</span>
        </div>
        <span className="monitor-stand" />
      </div>
      <div className="desk-keyboard" />
      <div className="desk-mouse" />
      <div className="desk-plant">
        <i />
        <i />
        <i />
        <span />
      </div>
      <div className="desk-book">NOTES & IDEAS</div>
      <div className="desk-cup" />
      <span className="workspace-tag">01 — ROOM TO THINK</span>
    </div>
  );
}
