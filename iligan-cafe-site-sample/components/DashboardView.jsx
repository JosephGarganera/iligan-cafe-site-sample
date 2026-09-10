import React, {useState, useEffect} from 'react'
import {useClient} from 'sanity'

export default function DashboardView() {
  const client = useClient({apiVersion: '2026-09-10'})
  const [sales, setSales] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch real-time transactional ledgers directly from the Sanity database lake
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const salesData = await client.fetch(`*[_type == "salesReceipt"] | order(timestamp desc)`)
        const itemData = await client.fetch(`*[_type == "menuItem"] | order(name asc)`)
        setSales(salesData || [])
        setInventory(itemData || [])
        setLoading(false)
      } catch (err) {
        console.error('Dashboard engine query breakdown:', err)
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // Accounting aggregates calculations
  const totalRevenue = sales.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
  const totalTransactions = sales.length
  const outOfStockItems = inventory.filter((item) => !item.isAvailable).length

  // SASS LEDGER COMPILER: Formats raw database array objects into clean CSV spreadsheets
  const exportToCSV = () => {
    if (sales.length === 0) return alert('No sales records available to export yet!')

    // Define clean bookkeeping column row mappings
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Payment Channel',
      'Total Gross Amount (PHP)',
      'Items Sold Breakdown',
    ]
    const rows = sales.map((txn) => [
      txn.receiptId || 'N/A',
      txn.timestamp ? txn.timestamp.replace('T', ' ').substring(0, 19) : 'N/A',
      txn.paymentMethod ? txn.paymentMethod.toUpperCase() : 'N/A',
      txn.totalAmount || 0,
      `"${(txn.itemsList || '').replace(/"/g, '""')}"`, // Sanitize quotes inside the breakdown text block
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    // Trigger automated virtual download pipeline inside the owner's web browser
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `iligan_cafe_ledger_${new Date().toISOString().substring(0, 10)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading)
    return (
      <div style={{padding: '2rem', fontFamily: 'sans-serif', color: '#666'}}>
        Loading operational ledgers...
      </div>
    )

  return (
    <div
      style={{
        padding: '2.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#F9F9FB',
        minHeight: '100vh',
      }}
    >
      {/* Header Dashboard Grid Control */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          borderBottom: '1px solid #E4E4E7',
          paddingBottom: '1.5rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#18181B',
              margin: 0,
              trackingTight: '-0.025em',
            }}
          >
            Operational Analytics Panel
          </h2>
          <p style={{color: '#71717A', fontSize: '0.875rem', marginTop: '0.25rem'}}>
            Real-time accounting summaries and spreadsheet ledger extraction utilities.
          </p>
        </div>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: '#18181B',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#27272A')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#18181B')}
        >
          📥 Export Ledger to Excel/CSV
        </button>
      </div>

      {/* Metric Cards Summary Blocks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #E4E4E7',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#71717A',
              textTransform: 'uppercase',
              tracking: '0.05em',
            }}
          >
            Gross Revenue Today
          </span>
          <h3 style={{fontSize: '2rem', fontWeight: 800, color: '#15803D', margin: '0.5rem 0 0 0'}}>
            ₱{totalRevenue.toLocaleString()}{' '}
            <span style={{fontSize: '1rem', fontWeight: 500, color: '#71717A'}}>PHP</span>
          </h3>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #E4E4E7',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#71717A',
              textTransform: 'uppercase',
              tracking: '0.05em',
            }}
          >
            Total POS Tickets
          </span>
          <h3 style={{fontSize: '2rem', fontWeight: 800, color: '#18181B', margin: '0.5rem 0 0 0'}}>
            {totalTransactions}{' '}
            <span style={{fontSize: '1rem', fontWeight: 500, color: '#71717A'}}>Sales</span>
          </h3>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #E4E4E7',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#71717A',
              textTransform: 'uppercase',
              tracking: '0.05em',
            }}
          >
            Critical Inventory Alerts
          </span>
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: outOfStockItems > 0 ? '#DC2626' : '#2563EB',
              margin: '0.5rem 0 0 0',
            }}
          >
            {outOfStockItems}{' '}
            <span style={{fontSize: '1rem', fontWeight: 500, color: '#71717A'}}>Sold Out</span>
          </h3>
        </div>
      </div>

      {/* Multi-User Split Logging Table Interface */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E4E4E7',
            backgroundColor: '#FAFAFA',
          }}
        >
          <h4 style={{margin: 0, fontWeight: 700, color: '#18181B', fontSize: '1rem'}}>
            Recent Transaction Ledger Logs
          </h4>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #E4E4E7',
                  color: '#71717A',
                  backgroundColor: '#F4F4F5',
                }}
              >
                <th style={{padding: '1rem 1.5rem', fontWeight: 600}}>Receipt ID</th>
                <th style={{padding: '1rem 1.5rem', fontWeight: 600}}>Timestamp</th>
                <th style={{padding: '1rem 1.5rem', fontWeight: 600}}>Payment Mode</th>
                <th style={{padding: '1rem 1.5rem', fontWeight: 600}}>Total Collected</th>
                <th style={{padding: '1rem 1.5rem', fontWeight: 600}}>Items Breakdown Summary</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '2rem',
                      textStyle: 'italic',
                      color: '#A1A1AA',
                      textAlignment: 'center',
                    }}
                  >
                    No POS data records compiled inside this customizer block framework yet.
                  </td>
                </tr>
              ) : (
                sales.map((txn) => (
                  <tr
                    key={txn._id}
                    style={{
                      borderBottom: '1px solid #F4F4F5',
                      color: '#27272A',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td
                      style={{
                        padding: '1rem 1.5rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#09090B',
                      }}
                    >
                      {txn.receiptId}
                    </td>
                    <td style={{padding: '1rem 1.5rem', color: '#71717A'}}>
                      {txn.timestamp?.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td style={{padding: '1rem 1.5rem'}}>
                      <span
                        style={{
                          backgroundColor: txn.paymentMethod === 'cash' ? '#FEF3C7' : '#DBEAFE',
                          color: txn.paymentMethod === 'cash' ? '#92400E' : '#1E40AF',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          uppercase: true,
                        }}
                      >
                        {txn.paymentMethod}
                      </span>
                    </td>
                    <td style={{padding: '1rem 1.5rem', fontWeight: 700, color: '#16A34A'}}>
                      {' '}
                      ₱{(txn.totalAmount || 0).toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '1rem 1.5rem',
                        color: '#52525B',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {txn.itemsList}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
