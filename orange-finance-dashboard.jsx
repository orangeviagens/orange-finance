import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Supabase Configuration
const SUPABASE_URL = 'https://igixjruaogfcjxqvohuw.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Color Scheme
const COLORS = {
  primary: '#F97316',
  secondary: '#FB923C',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#1E1E2E',
  surface: '#2A2A3A',
  border: '#3E3E4E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
};

const CATEGORY_COLORS = {
  banco_brasil: '#3B82F6',
  adquirente: '#8B5CF6',
  banco_usa: '#EC4899',
};

// Fallback data for when Supabase is unavailable
const FALLBACK_DATA = {
  bankAccounts: [
    { id: 1, name: 'CAIXA $$', balance_brl: 85300.00, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 2, name: 'Itau', balance_brl: 691629.94, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 3, name: 'Santander', balance_brl: 42849.48, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 4, name: 'Sicredi', balance_brl: 23718.36, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 5, name: 'XP', balance_brl: 0.00, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 6, name: 'Daycoval', balance_brl: 533.24, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 7, name: 'Safra', balance_brl: 53274.64, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 8, name: 'C6', balance_brl: 76.68, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 9, name: 'BB', balance_brl: 460689.75, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 10, name: 'BS2', balance_brl: 4.03, balance_usd: null, category: 'banco_brasil', is_active: true, updated_at: new Date().toISOString() },
    { id: 11, name: 'MP (Mercado Pago)', balance_brl: 1900.83, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 12, name: 'Iugu', balance_brl: 1784.72, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 13, name: 'Barte', balance_brl: 36382.00, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 14, name: 'DOM', balance_brl: 213708.98, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 15, name: 'Safrapay', balance_brl: 415292.76, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 16, name: 'Stone', balance_brl: 0.00, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 17, name: 'PagBank', balance_brl: 2591.27, balance_usd: null, category: 'adquirente', is_active: true, updated_at: new Date().toISOString() },
    { id: 18, name: 'Mercury', balance_brl: 64113.26, balance_usd: 12237.69, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
    { id: 19, name: 'Jeeves', balance_brl: 21212.76, balance_usd: 4049.01, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
    { id: 20, name: 'Stripe', balance_brl: 3757.83, balance_usd: 0.00, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
    { id: 21, name: 'BofA', balance_brl: 30723.70, balance_usd: 5864.42, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
    { id: 22, name: 'Cambio Real', balance_brl: 555.70, balance_usd: 106.07, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
    { id: 23, name: 'Regions', balance_brl: 0.00, balance_usd: 0.00, category: 'banco_usa', is_active: true, updated_at: new Date().toISOString() },
  ],
  creditLimits: [
    { id: 1, bank_name: 'CONTA SIMPLES', available_limit: 48.10, updated_at: new Date().toISOString() },
    { id: 2, bank_name: 'CLARA CARTOES', available_limit: 53945.27, updated_at: new Date().toISOString() },
    { id: 3, bank_name: 'BANCO DO BRASIL', available_limit: 3425.00, updated_at: new Date().toISOString() },
    { id: 4, bank_name: 'BANCO SANTANDER', available_limit: 888.00, updated_at: new Date().toISOString() },
    { id: 5, bank_name: 'BANCO C6', available_limit: 5359.56, updated_at: new Date().toISOString() },
  ],
  receivables: [
    { id: 1, source: 'DOM / BARTE', receive_date: '2026-03-30', amount: 213708.98, updated_at: new Date().toISOString() },
    { id: 2, source: 'DOM / BARTE', receive_date: '2026-03-31', amount: 0.00, updated_at: new Date().toISOString() },
  ],
  exchangeRates: [
    { id: 1, currency: 'USD', rate: 5.2390, updated_at: new Date().toISOString() },
    { id: 2, currency: 'EUR', rate: 6.0496, updated_at: new Date().toISOString() },
  ],
  specialCredits: [
    { id: 1, bank_name: 'Itau', credit_type: 'Cta Garantida', credit_limit: 200000.00, updated_at: new Date().toISOString() },
    { id: 2, bank_name: 'Daycoval', credit_type: 'Chq. Especial', credit_limit: 150000.00, updated_at: new Date().toISOString() },
    { id: 3, bank_name: 'Itau', credit_type: 'Chq Especial', credit_limit: 80000.00, updated_at: new Date().toISOString() },
    { id: 4, bank_name: 'BB', credit_type: 'Chq Especial', credit_limit: 150000.00, updated_at: new Date().toISOString() },
    { id: 5, bank_name: 'Safra', credit_type: 'Chq Especial', credit_limit: 50000.00, updated_at: new Date().toISOString() },
    { id: 6, bank_name: 'C6 / Santander', credit_type: 'Limite', credit_limit: 30000.00, updated_at: new Date().toISOString() },
  ],
};

// Utility Functions
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const parseFormattedCurrency = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));
};

// API Fetch Functions
const fetchFromSupabase = async (table) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${table}:`, error);
    return null;
  }
};

const updateInSupabase = async (table, id, data) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to update ${table}:`, error);
    return null;
  }
};

// Main Dashboard Component
export default function OrangeFinanceDashboard() {
  const [bankAccounts, setBankAccounts] = useState(FALLBACK_DATA.bankAccounts);
  const [creditLimits, setCreditLimits] = useState(FALLBACK_DATA.creditLimits);
  const [receivables, setReceivables] = useState(FALLBACK_DATA.receivables);
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_DATA.exchangeRates);
  const [specialCredits, setSpecialCredits] = useState(FALLBACK_DATA.specialCredits);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load data from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [banks, credits, receivable, rates, specCredits] = await Promise.all([
        fetchFromSupabase('bank_accounts'),
        fetchFromSupabase('credit_limits'),
        fetchFromSupabase('receivables'),
        fetchFromSupabase('exchange_rates'),
        fetchFromSupabase('special_credits'),
      ]);

      if (banks) setBankAccounts(banks);
      if (credits) setCreditLimits(credits);
      if (receivable) setReceivables(receivable);
      if (rates) setExchangeRates(rates);
      if (specCredits) setSpecialCredits(specCredits);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and refresh on mount
  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Handle cell editing
  const handleCellClick = (id, value, field, table) => {
    setEditingCell({ id, field, table });
    setEditValue(String(value || ''));
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const { id, field, table } = editingCell;
    const newValue = parseFormattedCurrency(editValue);

    let dataToUpdate = {};
    if (field === 'balance_brl' || field === 'balance_usd') {
      dataToUpdate[field] = newValue;
    } else if (field === 'available_limit') {
      dataToUpdate['available_limit'] = newValue;
    } else if (field === 'amount') {
      dataToUpdate['amount'] = newValue;
    }

    const success = await updateInSupabase(table, id, dataToUpdate);
    if (success) {
      if (table === 'bank_accounts') {
        setBankAccounts(bankAccounts.map(acc =>
          acc.id === id ? { ...acc, [field]: newValue, updated_at: new Date().toISOString() } : acc
        ));
      } else if (table === 'credit_limits') {
        setCreditLimits(creditLimits.map(cl =>
          cl.id === id ? { ...cl, available_limit: newValue, updated_at: new Date().toISOString() } : cl
        ));
      } else if (table === 'receivables') {
        setReceivables(receivables.map(r =>
          r.id === id ? { ...r, amount: newValue, updated_at: new Date().toISOString() } : r
        ));
      }
      setLastUpdated(new Date());
    }
    setEditingCell(null);
    setEditValue('');
  };

  // Calculate totals
  const calculateCategoryTotal = (category) => {
    return bankAccounts
      .filter(acc => acc.category === category && acc.is_active)
      .reduce((sum, acc) => sum + (acc.balance_brl || 0), 0);
  };

  const bancosBrasilTotal = calculateCategoryTotal('banco_brasil');
  const adquirentesTotal = calculateCategoryTotal('adquirente');
  const bancosUsaTotal = calculateCategoryTotal('banco_usa');
  const totalDisponivel = bancosBrasilTotal + adquirentesTotal + bancosUsaTotal;

  const creditCardsTotal = creditLimits.reduce((sum, cl) => sum + (cl.available_limit || 0), 0);
  const specialCreditsTotal = specialCredits.reduce((sum, sc) => sum + (sc.credit_limit || 0), 0);
  const projectedBalance = totalDisponivel + specialCreditsTotal;

  // Prepare chart data
  const categoryChartData = [
    { name: 'Bancos Brasil', value: bancosBrasilTotal, fill: CATEGORY_COLORS.banco_brasil },
    { name: 'Adquirentes', value: adquirentesTotal, fill: CATEGORY_COLORS.adquirente },
    { name: 'Bancos USA', value: bancosUsaTotal, fill: CATEGORY_COLORS.banco_usa },
  ];

  const topBanksData = bankAccounts
    .filter(b => b.is_active)
    .sort((a, b) => b.balance_brl - a.balance_brl)
    .slice(0, 10)
    .map(b => ({
      name: b.name,
      balance: b.balance_brl,
      fill: CATEGORY_COLORS[b.category],
    }));

  const receivablesTotal = receivables.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div style={{ backgroundColor: COLORS.background, color: COLORS.text }} className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6" style={{ borderBottomColor: COLORS.border }} className="border-b">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🍊</span>
            <h1 className="text-4xl font-bold" style={{ color: COLORS.primary }}>Orange Finance</h1>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              {currentTime.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Exchange Rates Bar */}
        <div className="flex gap-6 mb-8 justify-center" style={{ backgroundColor: COLORS.surface }} className="p-4 rounded-lg">
          {exchangeRates.map(rate => (
            <div key={rate.id} className="text-center">
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>{rate.currency}</p>
              <p className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(rate.rate)}
              </p>
            </div>
          ))}
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-4 px-4 py-2 rounded font-semibold transition-colors"
            style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
            onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.secondary}
            onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Disponível', value: totalDisponivel, color: COLORS.primary },
            { label: 'Bancos Brasil', value: bancosBrasilTotal, color: CATEGORY_COLORS.banco_brasil },
            { label: 'Adquirentes', value: adquirentesTotal, color: CATEGORY_COLORS.adquirente },
            { label: 'Bancos USA', value: bancosUsaTotal, color: CATEGORY_COLORS.banco_usa },
            { label: 'Crédito Disponível', value: creditCardsTotal, color: COLORS.success },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{ backgroundColor: COLORS.surface }}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLORS.border }}
            >
              <p className="text-sm mb-2" style={{ color: COLORS.textSecondary }}>{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: card.color }}>
                {formatCurrency(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Bank Accounts Table */}
        <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg mb-8 border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Contas Bancárias</h2>

          {['banco_brasil', 'adquirente', 'banco_usa'].map(category => {
            const categoryAccounts = bankAccounts.filter(b => b.category === category && b.is_active);
            const categoryTotal = categoryAccounts.reduce((sum, b) => sum + (b.balance_brl || 0), 0);
            const categoryLabel = {
              banco_brasil: 'Bancos Brasil',
              adquirente: 'Adquirentes',
              banco_usa: 'Bancos USA',
            }[category];

            return (
              <div key={category} className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: CATEGORY_COLORS[category] }}>
                  {categoryLabel}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottomColor: COLORS.border }} className="border-b">
                        <th className="text-left py-2 px-3" style={{ color: COLORS.textSecondary }}>Banco</th>
                        <th className="text-right py-2 px-3" style={{ color: COLORS.textSecondary }}>Saldo BRL</th>
                        {category === 'banco_usa' && (
                          <th className="text-right py-2 px-3" style={{ color: COLORS.textSecondary }}>Saldo USD</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {categoryAccounts.map(account => (
                        <tr key={account.id} style={{ borderBottomColor: COLORS.border }} className="border-b hover:opacity-75">
                          <td className="py-2 px-3">{account.name}</td>
                          <td className="text-right py-2 px-3">
                            {editingCell?.id === account.id && editingCell?.field === 'balance_brl' && editingCell?.table === 'bank_accounts' ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleCellSave}
                                onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                                className="w-32 px-2 py-1 rounded text-black"
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => handleCellClick(account.id, account.balance_brl, 'balance_brl', 'bank_accounts')}
                                className="cursor-pointer hover:opacity-75"
                              >
                                {formatCurrency(account.balance_brl)}
                              </span>
                            )}
                          </td>
                          {category === 'banco_usa' && (
                            <td className="text-right py-2 px-3">
                              {editingCell?.id === account.id && editingCell?.field === 'balance_usd' && editingCell?.table === 'bank_accounts' ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleCellSave}
                                  onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                                  className="w-32 px-2 py-1 rounded text-black"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  onClick={() => handleCellClick(account.id, account.balance_usd, 'balance_usd', 'bank_accounts')}
                                  className="cursor-pointer hover:opacity-75"
                                >
                                  {account.balance_usd !== null ? `$${account.balance_usd.toFixed(2)}` : '-'}
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-right font-semibold pr-3" style={{ color: CATEGORY_COLORS[category] }}>
                  Subtotal: {formatCurrency(categoryTotal)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg border" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Distribuição por Categoria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg border" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Top 10 Bancos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBanksData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="name" stroke={COLORS.textSecondary} tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke={COLORS.textSecondary} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}` }} />
                <Bar dataKey="balance" radius={[8, 8, 0, 0]}>
                  {topBanksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit Limits Table */}
        <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg mb-8 border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Limites de Crédito</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: COLORS.border }} className="border-b">
                  <th className="text-left py-2 px-3" style={{ color: COLORS.textSecondary }}>Banco</th>
                  <th className="text-right py-2 px-3" style={{ color: COLORS.textSecondary }}>Limite Disponível</th>
                </tr>
              </thead>
              <tbody>
                {creditLimits.map(limit => (
                  <tr key={limit.id} style={{ borderBottomColor: COLORS.border }} className="border-b hover:opacity-75">
                    <td className="py-2 px-3">{limit.bank_name}</td>
                    <td className="text-right py-2 px-3">
                      {editingCell?.id === limit.id && editingCell?.field === 'available_limit' && editingCell?.table === 'credit_limits' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                          className="w-32 px-2 py-1 rounded text-black"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => handleCellClick(limit.id, limit.available_limit, 'available_limit', 'credit_limits')}
                          className="cursor-pointer hover:opacity-75"
                        >
                          {formatCurrency(limit.available_limit)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right font-semibold pr-3" style={{ color: COLORS.success }}>
            Total Disponível: {formatCurrency(creditCardsTotal)}
          </div>
        </div>

        {/* Receivables Section */}
        <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg mb-8 border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>A Receber Adquirentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: COLORS.border }} className="border-b">
                  <th className="text-left py-2 px-3" style={{ color: COLORS.textSecondary }}>Origem</th>
                  <th className="text-center py-2 px-3" style={{ color: COLORS.textSecondary }}>Data de Recebimento</th>
                  <th className="text-right py-2 px-3" style={{ color: COLORS.textSecondary }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {receivables.map(r => (
                  <tr key={r.id} style={{ borderBottomColor: COLORS.border }} className="border-b hover:opacity-75">
                    <td className="py-2 px-3">{r.source}</td>
                    <td className="text-center py-2 px-3">{new Date(r.receive_date).toLocaleDateString('pt-BR')}</td>
                    <td className="text-right py-2 px-3">
                      {editingCell?.id === r.id && editingCell?.field === 'amount' && editingCell?.table === 'receivables' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                          className="w-32 px-2 py-1 rounded text-black"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => handleCellClick(r.id, r.amount, 'amount', 'receivables')}
                          className="cursor-pointer hover:opacity-75"
                        >
                          {formatCurrency(r.amount)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right font-semibold pr-3" style={{ color: COLORS.warning }}>
            Total a Receber: {formatCurrency(receivablesTotal)}
          </div>
        </div>

        {/* Special Credits Section */}
        <div style={{ backgroundColor: COLORS.surface }} className="p-6 rounded-lg border" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Créditos Especiais (Itau Projetado)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: COLORS.border }} className="border-b">
                  <th className="text-left py-2 px-3" style={{ color: COLORS.textSecondary }}>Banco</th>
                  <th className="text-left py-2 px-3" style={{ color: COLORS.textSecondary }}>Tipo de Crédito</th>
                  <th className="text-right py-2 px-3" style={{ color: COLORS.textSecondary }}>Limite</th>
                </tr>
              </thead>
              <tbody>
                {specialCredits.map(sc => (
                  <tr key={sc.id} style={{ borderBottomColor: COLORS.border }} className="border-b">
                    <td className="py-2 px-3">{sc.bank_name}</td>
                    <td className="py-2 px-3">{sc.credit_type}</td>
                    <td className="text-right py-2 px-3">{formatCurrency(sc.credit_limit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right font-semibold pr-3" style={{ color: COLORS.primary }}>
            Total Créditos Especiais: {formatCurrency(specialCreditsTotal)}
          </div>
          <div className="mt-2 text-right font-bold text-lg pr-3" style={{ color: COLORS.success }}>
            Saldo Projetado (com créditos): {formatCurrency(projectedBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}