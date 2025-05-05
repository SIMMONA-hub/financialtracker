// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
    Box, Heading, VStack, HStack, Select, Text,
    useColorModeValue, SimpleGrid, Stat, StatLabel,
    StatNumber, StatHelpText, StatArrow, Divider,
    FormControl, FormLabel, Tooltip, Button
} from '@chakra-ui/react';
import { API_URL } from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Sector } from 'recharts';

// Цвета для расходов
const EXPENSE_COLORS = [
    '#FF8042', '#FF6347', '#FF4500', '#FF0000', '#DC143C',
    '#B22222', '#8B0000', '#800000', '#A52A2A', '#FF69B4'
];

// Цвета для доходов
const INCOME_COLORS = [
    '#00C49F', '#008B8B', '#2E8B57', '#3CB371', '#66CDAA',
    '#20B2AA', '#00FA9A', '#00FF7F', '#7FFF00', '#32CD32'
];

// Компонент активного сектора для анимации при наведении
const renderActiveShape = (props) => {
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value, name
    } = props;

    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 5}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                opacity={0.9}
            />
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
                {name}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>
                {`${value.toLocaleString()} ₸ (${(percent * 100).toFixed(1)}%)`}
            </text>
        </g>
    );
};

export default function Dashboard() {
    const [txs, setTxs] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState('');
    const [activeExpenseIndex, setActiveExpenseIndex] = useState(-1);
    const [activeIncomeIndex, setActiveIncomeIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create years array for dropdown (last 10 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 10}, (_, i) => (currentYear - i).toString());

    // Create months array for dropdown
    const months = [
        {value: '1', label: 'Январь'},
        {value: '2', label: 'Февраль'},
        {value: '3', label: 'Март'},
        {value: '4', label: 'Апрель'},
        {value: '5', label: 'Май'},
        {value: '6', label: 'Июнь'},
        {value: '7', label: 'Июль'},
        {value: '8', label: 'Август'},
        {value: '9', label: 'Сентябрь'},
        {value: '10', label: 'Октябрь'},
        {value: '11', label: 'Ноябрь'},
        {value: '12', label: 'Декабрь'}
    ];

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();

            // Filter by year (and optionally month)
            const startYear = parseInt(year);
            const startMonth = month ? parseInt(month) - 1 : 0;
            const endMonth = month ? parseInt(month) : 11;

            const startDate = new Date(startYear, startMonth, 1);
            const endDate = new Date(startYear, endMonth, month ? 0 : 31);

            // Ensure dates are not in the future
            const currentDate = new Date();
            if (startDate > currentDate) {
                startDate.setFullYear(currentDate.getFullYear());
                startDate.setMonth(currentDate.getMonth());
                startDate.setDate(1);
            }

            if (endDate > currentDate) {
                endDate.setTime(currentDate.getTime());
            }

            params.append('startDate', startDate.toISOString().split('T')[0]);
            params.append('endDate', endDate.toISOString().split('T')[0]);

            const res = await fetch(`${API_URL}/transactions?${params}`);
            if (!res.ok) {
                console.error('Ошибка API:', res.status);
                setError(`Ошибка при загрузке данных: ${res.status}`);
                setTxs([]);
                return;
            }

            const data = await res.json();

            // Проверка, что data существует и является массивом
            if (!data || !Array.isArray(data)) {
                console.error('Некорректные данные:', data);
                setError('Получены некорректные данные от сервера');
                setTxs([]);
                return;
            }

            setTxs(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setError(`Ошибка при загрузке данных: ${error.message}`);
            setTxs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);

    // Calculate stats
    const income = txs.filter(t => t && t.type === 'income').reduce((s, t) => s + (t?.amount || 0), 0);
    const expense = txs.filter(t => t && t.type === 'expense').reduce((s, t) => s + (t?.amount || 0), 0);
    const balance = income - expense;

    // Group by category
    const expenseByCategory = {};
    txs.filter(t => t && t.type === 'expense').forEach(tx => {
        // Проверим, что категория существует
        const category = tx.category || 'Прочее';
        expenseByCategory[category] = (expenseByCategory[category] || 0) + (tx?.amount || 0);
    });

    const incomeByCategory = {};
    txs.filter(t => t && t.type === 'income').forEach(tx => {
        // Проверим, что категория существует
        const category = tx.category || 'Прочее';
        incomeByCategory[category] = (incomeByCategory[category] || 0) + (tx?.amount || 0);
    });

    // Подготовка данных для диаграммы расходов
    const expenseChartData = Object.entries(expenseByCategory)
        .map(([category, amount]) => ({
            name: category,
            value: amount
        }))
        .sort((a, b) => b.value - a.value); // Сортировка по убыванию суммы

    // Подготовка данных для диаграммы доходов
    const incomeChartData = Object.entries(incomeByCategory)
        .map(([category, amount]) => ({
            name: category,
            value: amount
        }))
        .sort((a, b) => b.value - a.value); // Сортировка по убыванию суммы

    // Group by month if viewing full year
    const byMonth = {};
    if (!month) {
        txs.forEach(tx => {
            if (!tx || !tx.date) return;

            const txMonth = new Date(tx.date).getMonth();
            byMonth[txMonth] = byMonth[txMonth] || { income: 0, expense: 0 };
            if (tx.type === 'income') {
                byMonth[txMonth].income += tx.amount || 0;
            } else {
                byMonth[txMonth].expense += tx.amount || 0;
            }
        });
    }

    // Group by day if viewing specific month
    const byDay = {};
    if (month) {
        txs.forEach(tx => {
            if (!tx || !tx.date) return;

            const txDay = new Date(tx.date).getDate();
            byDay[txDay] = byDay[txDay] || { income: 0, expense: 0 };
            if (tx.type === 'income') {
                byDay[txDay].income += tx.amount || 0;
            } else {
                byDay[txDay].expense += tx.amount || 0;
            }
        });
    }

    const bg = useColorModeValue('white', 'gray.800');
    const shadow = "xl";
    const statBg = useColorModeValue('gray.50', 'gray.700');

    // Обработчики событий для интерактивности диаграмм
    const onPieEnterExpense = (_, index) => {
        setActiveExpenseIndex(index);
    };

    const onPieLeaveExpense = () => {
        setActiveExpenseIndex(-1);
    };

    const onPieEnterIncome = (_, index) => {
        setActiveIncomeIndex(index);
    };

    const onPieLeaveIncome = () => {
        setActiveIncomeIndex(-1);
    };

    // Отображение загрузки или ошибки
    if (isLoading) {
        return (
            <Box w="100%" p={6} bg={bg} boxShadow={shadow} borderRadius="2xl" textAlign="center">
                <Text>Загрузка данных...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box w="100%" p={6} bg={bg} boxShadow={shadow} borderRadius="2xl">
                <Text color="red.500" fontWeight="bold">
                    {error}
                </Text>
                <Button colorScheme="brand" mt={4} onClick={fetchData}>
                    Попробовать снова
                </Button>
            </Box>
        );
    }

    return (
        <Box w="100%" p={6} bg={bg} boxShadow={shadow} borderRadius="2xl">
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between" wrap="wrap">
                    <Heading size="md" color="brand.600">Финансовая аналитика</Heading>

                    <HStack spacing={4}>
                        <FormControl maxW="150px">
                            <FormLabel fontSize="sm">Месяц</FormLabel>
                            <Select
                                placeholder="Весь год"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                size="sm"
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl maxW="120px">
                            <FormLabel fontSize="sm">Год</FormLabel>
                            <Select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                size="sm"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </HStack>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Box p={4} bg={statBg} borderRadius="xl" boxShadow="sm">
                        <Stat>
                            <StatLabel color="gray.500">Доходы</StatLabel>
                            <StatNumber color="green.500" fontSize="2xl">
                                {income.toLocaleString()} ₸
                            </StatNumber>
                            <StatHelpText>
                                {month
                                    ? `${months.find(m => m.value === month)?.label} ${year}`
                                    : `Весь ${year} год`
                                }
                            </StatHelpText>
                        </Stat>
                    </Box>

                    <Box p={4} bg={statBg} borderRadius="xl" boxShadow="sm">
                        <Stat>
                            <StatLabel color="gray.500">Расходы</StatLabel>
                            <StatNumber color="red.500" fontSize="2xl">
                                {expense.toLocaleString()} ₸
                            </StatNumber>
                            <StatHelpText>
                                {month
                                    ? `${months.find(m => m.value === month)?.label} ${year}`
                                    : `Весь ${year} год`
                                }
                            </StatHelpText>
                        </Stat>
                    </Box>

                    <Box p={4} bg={statBg} borderRadius="xl" boxShadow="sm">
                        <Stat>
                            <StatLabel color="gray.500">Баланс</StatLabel>
                            <StatNumber
                                color={balance >= 0 ? 'green.500' : 'red.500'}
                                fontSize="2xl"
                            >
                                {balance.toLocaleString()} ₸
                            </StatNumber>
                            <StatHelpText>
                                Экономия: {income > 0 ? Math.round((income - expense) / income * 100) : 0}%
                            </StatHelpText>
                        </Stat>
                    </Box>
                </SimpleGrid>

                <Divider />

                {/* Круговые диаграммы */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Диаграмма расходов по категориям */}
                    <Box>
                        <Heading size="sm" mb={4} textAlign="center">Расходы по категориям</Heading>
                        {expenseChartData.length > 0 ? (
                            <Box h="300px">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeExpenseIndex}
                                            activeShape={renderActiveShape}
                                            data={expenseChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={onPieEnterExpense}
                                            onMouseLeave={onPieLeaveExpense}
                                        >
                                            {expenseChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.500">Нет данных о расходах</Text>
                            </Box>
                        )}

                        {/* Топ категории расходов */}
                        <VStack align="stretch" spacing={2} mt={4}>
                            {Object.entries(expenseByCategory)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([category, amount], index) => (
                                    <HStack key={category} justify="space-between">
                                        <HStack>
                                            <Box
                                                w="12px"
                                                h="12px"
                                                borderRadius="full"
                                                bg={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                                                mr={2}
                                            />
                                            <Text>{category}</Text>
                                        </HStack>
                                        <Text color="red.500" fontWeight="medium">
                                            {amount.toLocaleString()} ₸
                                        </Text>
                                    </HStack>
                                ))
                            }
                        </VStack>
                    </Box>

                    {/* Диаграмма доходов по категориям */}
                    <Box>
                        <Heading size="sm" mb={4} textAlign="center">Доходы по категориям</Heading>
                        {incomeChartData.length > 0 ? (
                            <Box h="300px">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIncomeIndex}
                                            activeShape={renderActiveShape}
                                            data={incomeChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={onPieEnterIncome}
                                            onMouseLeave={onPieLeaveIncome}
                                        >
                                            {incomeChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.500">Нет данных о доходах</Text>
                            </Box>
                        )}

                        {/* Топ категории доходов */}
                        <VStack align="stretch" spacing={2} mt={4}>
                            {Object.entries(incomeByCategory)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([category, amount], index) => (
                                    <HStack key={category} justify="space-between">
                                        <HStack>
                                            <Box
                                                w="12px"
                                                h="12px"
                                                borderRadius="full"
                                                bg={INCOME_COLORS[index % INCOME_COLORS.length]}
                                                mr={2}
                                            />
                                            <Text>{category}</Text>
                                        </HStack>
                                        <Text color="green.500" fontWeight="medium">
                                            {amount.toLocaleString()} ₸
                                        </Text>
                                    </HStack>
                                ))
                            }
                        </VStack>
                    </Box>
                </SimpleGrid>

                {/* Monthly or Daily breakdown */}
                <Box>
                    <Heading size="sm" mb={4}>
                        {month ? 'Ежедневная динамика' : 'Ежемесячная динамика'}
                    </Heading>

                    {month ? (
                        // Daily breakdown for selected month
                        <SimpleGrid columns={{ base: 2, md: 7 }} spacing={2}>
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                                const dayData = byDay[day] || { income: 0, expense: 0 };
                                const dayBalance = dayData.income - dayData.expense;
                                return (
                                    <Box
                                        key={day}
                                        p={2}
                                        borderRadius="md"
                                        bg={dayData.income > 0 || dayData.expense > 0
                                            ? useColorModeValue('gray.50', 'gray.700')
                                            : 'transparent'
                                        }
                                        textAlign="center"
                                    >
                                        <Text fontSize="xs" color="gray.500">{day}</Text>
                                        {dayData.income > 0 && (
                                            <Text fontSize="xs" color="green.500">
                                                +{dayData.income.toLocaleString()}
                                            </Text>
                                        )}
                                        {dayData.expense > 0 && (
                                            <Text fontSize="xs" color="red.500">
                                                -{dayData.expense.toLocaleString()}
                                            </Text>
                                        )}
                                        {dayData.income > 0 || dayData.expense > 0 ? (
                                            <Text fontSize="xs" color={dayBalance >= 0 ? "green.500" : "red.500"}>
                                                Баланс: {dayBalance.toLocaleString()}
                                            </Text>
                                        ) : null}
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    ) : (
                        // Monthly breakdown for selected year
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                            {months.map((monthObj, idx) => {
                                const monthData = byMonth[idx] || { income: 0, expense: 0 };
                                const monthBalance = monthData.income - monthData.expense;
                                return (
                                    <Box
                                        key={monthObj.value}
                                        p={3}
                                        borderRadius="lg"
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                    >
                                        <Text fontWeight="medium">{monthObj.label}</Text>
                                        <HStack justify="space-between" mt={1}>
                                            <Text fontSize="sm" color="green.500">
                                                +{monthData.income.toLocaleString()}
                                            </Text>
                                            <Text fontSize="sm" color="red.500">
                                                -{monthData.expense.toLocaleString()}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="sm" color={monthBalance >= 0
                                            ? 'green.500'
                                            : 'red.500'
                                        }>
                                            Баланс: {monthBalance.toLocaleString()}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}