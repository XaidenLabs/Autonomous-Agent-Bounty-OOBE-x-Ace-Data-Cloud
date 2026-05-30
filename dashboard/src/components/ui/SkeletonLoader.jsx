import { C } from './Shared';

/* ─── Base shimmer block ──────────────────────────────────────── */
const Sk = ({ w = '100%', h = 14, br = 6, style = {} }) => (
  <div
    className="sk-shimmer"
    style={{
      width: w, height: h, borderRadius: br,
      background: 'linear-gradient(90deg, #1a1a1a 25%, #262626 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'sk-shimmer 1.6s infinite linear',
      flexShrink: 0,
      ...style,
    }}
  />
);

/* ─── Card shell ──────────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: '15px 17px', ...style,
  }}>
    {children}
  </div>
);

/* ─── Metric card skeleton ────────────────────────────────────── */
const MetricSk = () => (
  <Card>
    <Sk w="55%" h={10} br={4} style={{ marginBottom: 10 }} />
    <Sk w="40%" h={22} br={5} style={{ marginBottom: 12 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Sk w="60%" h={9} br={4} />
      <Sk w={50} h={26} br={4} />
    </div>
  </Card>
);

/* ─── Table row skeleton ──────────────────────────────────────── */
const TableRowSk = ({ isMobile }) => (
  <tr>
    <td style={{ padding: '10px', borderBottom: `1px solid ${C.border2}` }}>
      <Sk w={28} h={11} br={4} />
    </td>
    <td style={{ padding: '10px', borderBottom: `1px solid ${C.border2}` }}>
      <Sk w={isMobile ? '80%' : '85%'} h={11} br={4} />
    </td>
    {!isMobile && (
      <td style={{ padding: '10px', borderBottom: `1px solid ${C.border2}` }}>
        <Sk w={50} h={18} br={20} />
      </td>
    )}
    {!isMobile && (
      <td style={{ padding: '10px', borderBottom: `1px solid ${C.border2}` }}>
        <Sk w={60} h={11} br={4} />
      </td>
    )}
    <td style={{ padding: '10px', borderBottom: `1px solid ${C.border2}`, textAlign: 'right' }}>
      <Sk w={40} h={18} br={20} style={{ marginLeft: 'auto' }} />
    </td>
  </tr>
);

/* ─── Full dashboard skeleton ─────────────────────────────────── */
export default function SkeletonLoader({ isMobile, isTablet }) {
  return (
    <>
      {/* Inject keyframe once */}
      <style>{`
        @keyframes sk-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Metrics row — 4 cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 12, marginBottom: 16,
      }}>
        {[0,1,2,3].map(i => <MetricSk key={i} />)}
      </div>

      {/* Main 2-col */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 330px',
        gap: 16,
      }}>
        {/* Left */}
        <div style={{ minWidth: 0 }}>
          {/* Chart card */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <Sk w={100} h={9} br={4} style={{ marginBottom: 8 }} />
                <Sk w={70} h={26} br={5} style={{ marginBottom: 6 }} />
                <Sk w={120} h={9} br={4} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,1,2,3,4,5].map(i => <Sk key={i} w={30} h={22} br={6} />)}
              </div>
            </div>
            {/* Bars placeholder */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
              {Array.from({ length: isMobile ? 18 : 30 }).map((_, i) => (
                <Sk
                  key={i}
                  w="100%"
                  h={`${20 + Math.sin(i * 0.7) * 15 + 25}%`}
                  br={3}
                  style={{ flex: 1 }}
                />
              ))}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border2}` }}>
              {[0,1,2,3].map(i => <Sk key={i} w={70} h={18} br={6} />)}
            </div>
          </Card>

          {/* Run table card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Sk w={110} h={10} br={4} />
              <Sk w={70} h={24} br={6} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Loop','Insight','Risk','Lamports','Status'].map((h, i) => (
                    (i <= 1 || (!isMobile && i === 2) || (!isTablet && i === 3) || i === 4) && (
                      <th key={h} style={{
                        padding: '7px 10px',
                        borderBottom: `1px solid ${C.border2}`,
                        textAlign: i === 4 ? 'right' : 'left',
                      }}>
                        <Sk w={i === 4 ? 40 : 55} h={9} br={4} style={i === 4 ? { marginLeft: 'auto' } : {}} />
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0,1,2,3,4].map(i => <TableRowSk key={i} isMobile={isMobile} />)}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {/* Latest risk card */}
          <Card>
            <Sk w={90} h={9} br={4} style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              {/* Ring placeholder */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(90deg,#1a1a1a 25%,#262626 50%,#1a1a1a 75%)',
                backgroundSize: '200% 100%',
                animation: 'sk-shimmer 1.6s infinite linear',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <Sk w={80} h={18} br={20} style={{ marginBottom: 8 }} />
                <Sk w="90%" h={10} br={4} style={{ marginBottom: 5 }} />
                <Sk w="70%" h={10} br={4} style={{ marginBottom: 5 }} />
                <Sk w={60} h={9} br={4} />
              </div>
            </div>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '9px 0',
                borderBottom: `1px solid ${C.border2}`,
              }}>
                <Sk w={80} h={10} br={4} />
                <Sk w={90} h={10} br={4} />
              </div>
            ))}
          </Card>

          {/* AI services card */}
          <Card>
            <Sk w={120} h={9} br={4} style={{ marginBottom: 14 }} />
            {[0,1,2].map(i => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 0', borderBottom: `1px solid ${C.border2}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sk w={29} h={29} br={7} />
                  <Sk w={80} h={10} br={4} />
                </div>
                <Sk w={55} h={18} br={20} />
              </div>
            ))}
          </Card>

          {/* Quick actions card */}
          <Card>
            <Sk w={100} h={9} br={4} style={{ marginBottom: 14 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[0,1,2,3].map(i => <Sk key={i} w="100%" h={34} br={8} />)}
            </div>
          </Card>

          {/* Network card */}
          <Card>
            <Sk w={100} h={9} br={4} style={{ marginBottom: 14 }} />
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '9px 0',
                borderBottom: `1px solid ${C.border2}`,
              }}>
                <Sk w={80} h={10} br={4} />
                <Sk w={70} h={10} br={4} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
