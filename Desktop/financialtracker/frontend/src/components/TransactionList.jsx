// components/TransactionList.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, HStack, Input, Table, Thead, Tbody,
    Tr, Th, Td, IconButton, useColorModeValue,
    Flex, Badge, Text, Select, InputGroup,
    InputLeftElement, Icon, VStack, Divider,
    Stat, StatLabel, StatNumber, StatGroup,
    StatHelpText, StatArrow, useBreakpointValue,
    Menu, MenuButton, MenuList, MenuItem,
    Tooltip, FormLabel, FormControl, Tag
} from '@chakra-ui/react';
import {
    FiEdit2, FiTrash2, FiCalendar, FiFilter,
    FiChevronDown, FiDownload, FiPrinter
} from 'react-icons/fi';
import { API_URL } from '../api';

export default function TransactionList({ onEdit }) {
    const [txs, setTxs] = useState([]);
    const [catFilter, setCatFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (catFilter) params.append('category', catFilter);
            if (typeFilter) params.append('type', typeFilter);

            // Handle date filtering
            if (month && year) {
                // Get start and end date for selected month
                const currentDate = new Date();
                const selectedYear = parseInt(year);
                const selectedMonth = parseInt(month) - 1;

                // Create dates but ensure they're not in the future
                const startDate = new Date(selectedYear, selectedMonth, 1);
                const endDate = new Date(selectedYear, selectedMonth + 1, 0);

                if (startDate > currentDate) {
                    startDate.setFullYear(currentDate.getFullYear());
                    startDate.setMonth(currentDate.getMonth());
                    startDate.setDate(1);
                }

                if (endDate > currentDate) {
                    endDate.setTime(currentDate.getTime());
                }

                const formattedStartDate = startDate.toISOString().split('T')[0];
                const formattedEndDate = endDate.toISOString().split('T')[0];

                params.append('startDate', formattedStartDate);
                params.append('endDate', formattedEndDate);
            } else {
                // Use regular date range if month/year not selected
                if (from) params.append('startDate', from);
                if (to) params.append('endDate', to);
            }

            const res = await fetch(`${API_URL}/transactions?${params}`);
            if (!res.ok) {
                console.error('Ошибка API:', res.status);
                setTxs([]);
                return;
            }

            const data = await res.json();

            // Sort by date (newest first)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTxs(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setTxs([]);
        }
    };

    useEffect(() => {
        // Set current year as default
        setYear(new Date().getFullYear().toString());
        fetchData();
    }, []);

    const handleDelete = async id => {
        if (!confirm('Удалить?')) return;
        try {
            const res = await fetch(`${API_URL}/transactions/${id}`, { method:'DELETE' });
            if (!res.ok) {
                console.error('Ошибка при удалении:', res.status);
                return;
            }
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const income = txs.filter(t => t.type==='income').reduce((s,t)=>s+t.amount,0);
    const expense = txs.filter(t => t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const balance = income - expense;

    // Calculate percentage change from previous period (placeholder)
    const incomeChange = 5.2; // This would be calculated from previous data
    const expenseChange = -2.8; // This would be calculated from previous data

    const bg = useColorModeValue('white','gray.800');
    const shadow = "xl";
    const statBg = useColorModeValue('gray.50', 'gray.700');

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

    // Create categories array for dropdown
    const categories = [
        'Зарплата', 'Инвестиции', 'Подарки', 'Прочие доходы',
        'Продукты', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Образование', 'Прочие расходы'
    ];

    // Responsive layout
    const tableDisplay = useBreakpointValue({ base: 'none', md: 'block' });
    const mobileDisplay = useBreakpointValue({ base: 'block', md: 'none' });

    const clearFilters = () => {
        setCatFilter('');
        setTypeFilter('');
        setFrom('');
        setTo('');
        setMonth('');
        // Keep year as current year
        setYear(new Date().getFullYear().toString());
        fetchData();
    };

    const exportData = () => {
        const dataStr = JSON.stringify(txs);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'transactions.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <Box w="100%" p={6} bg={bg} boxShadow={shadow} borderRadius="2xl">
            {/* Статистика */}
            <StatGroup
                mb={8}
                p={4}
                bg={statBg}
                borderRadius="xl"
                boxShadow="sm"
            >
                <Stat textAlign="center">
                    <StatLabel color="gray.500" fontSize="sm">Доходы</StatLabel>
                    <StatNumber color="green.500" fontSize="2xl" fontWeight="bold">
                        {income.toLocaleString()} ₸
                    </StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        {incomeChange}%
                    </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                    <StatLabel color="gray.500" fontSize="sm">Расходы</StatLabel>
                    <StatNumber color="red.500" fontSize="2xl" fontWeight="bold">
                        {expense.toLocaleString()} ₸
                    </StatNumber>
                    <StatHelpText>
                        <StatArrow type="decrease" />
                        {Math.abs(expenseChange)}%
                    </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                    <StatLabel color="gray.500" fontSize="sm">Баланс</StatLabel>
                    <StatNumber
                        color={balance >= 0 ? 'green.500' : 'red.500'}
                        fontSize="2xl"
                        fontWeight="bold"
                    >
                        {balance.toLocaleString()} ₸
                    </StatNumber>
                    <StatHelpText>
                        {balance >= 0 ? 'Позитивный баланс' : 'Отрицательный баланс'}
                    </StatHelpText>
                </Stat>
            </StatGroup>

            {/* Кнопки управления и фильтрация */}
            <HStack mb={4} justify="space-between" wrap="wrap">
                <Button
                    leftIcon={<FiFilter />}
                    onClick={() => setShowFilters(!showFilters)}
                    colorScheme="brand"
                    variant="outline"
                    size="sm"
                >
                    {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>

                <HStack>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
                            Экспорт
                        </MenuButton>
                        <MenuList>
                            <MenuItem icon={<FiDownload />} onClick={exportData}>
                                Скачать JSON
                            </MenuItem>
                            <MenuItem icon={<FiPrinter />}>
                                Распечатать
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>

            {/* Расширенные фильтры */}
            {showFilters && (
                <Box
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    p={4}
                    borderRadius="xl"
                    mb={6}
                    boxShadow="sm"
                >
                    <VStack spacing={4}>
                        <HStack w="100%" spacing={4} wrap="wrap">
                            <FormControl maxW="200px">
                                <FormLabel fontSize="sm">Категория</FormLabel>
                                <Select
                                    placeholder="Все категории"
                                    value={catFilter}
                                    onChange={e => setCatFilter(e.target.value)}
                                    size="sm"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl maxW="150px">
                                <FormLabel fontSize="sm">Тип</FormLabel>
                                <Select
                                    placeholder="Все"
                                    value={typeFilter}
                                    onChange={e => setTypeFilter(e.target.value)}
                                    size="sm"
                                >
                                    <option value="income">Доход</option>
                                    <option value="expense">Расход</option>
                                </Select>
                            </FormControl>

                            <Divider orientation="vertical" height="40px" />

                            <FormControl maxW="150px">
                                <FormLabel fontSize="sm">Месяц</FormLabel>
                                <Select
                                    placeholder="Выберите месяц"
                                    value={month}
                                    onChange={e => setMonth(e.target.value)}
                                    size="sm"
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl maxW="150px">
                                <FormLabel fontSize="sm">Год</FormLabel>
                                <Select
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                    size="sm"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <Divider />

                        <HStack w="100%" spacing={4}>
                            <FormControl>
                                <FormLabel fontSize="sm">С даты</FormLabel>
                                <Input
                                    type="date"
                                    value={from}
                                    onChange={e => setFrom(e.target.value)}
                                    size="sm"
                                    isDisabled={month && year}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm">По дату</FormLabel>
                                <Input
                                    type="date"
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                    size="sm"
                                    isDisabled={month && year}
                                />
                            </FormControl>
                        </HStack>

                        <HStack justify="center" spacing={4}>
                            <Button onClick={fetchData} colorScheme="brand" size="sm">
                                Применить
                            </Button>
                            <Button onClick={clearFilters} variant="outline" size="sm">
                                Очистить
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            )}

            {/* Таблица (для десктопа) */}
            <Box overflowX="auto" display={tableDisplay}>
                <Table variant="simple" colorScheme="gray" size="sm">
                    <Thead bg="brand.500">
                        <Tr>
                            <Th color="white">Сумма</Th>
                            <Th color="white">Категория</Th>
                            <Th color="white">Тип</Th>
                            <Th color="white">Дата</Th>
                            <Th color="white">Описание</Th>
                            <Th color="white">Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {txs.length > 0 ? txs.map(tx => (
                            <Tr key={tx._id}
                                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                                transition="all 0.2s"
                            >
                                <Td fontWeight="medium">
                                    <Text color={tx.type === 'income' ? 'green.500' : 'red.500'}>
                                        {tx.amount.toLocaleString()} ₸
                                    </Text>
                                </Td>
                                <Td>
                                    <Tag
                                        size="sm"
                                        colorScheme={tx.type === 'income' ? 'green' : 'red'}
                                        borderRadius="full"
                                    >
                                        {tx.category}
                                    </Tag>
                                </Td>
                                <Td>{tx.type === 'income' ? '💰' : '💸'}</Td>
                                <Td>{new Date(tx.date).toLocaleDateString()}</Td>
                                <Td>{tx.description}</Td>
                                <Td>
                                    <Tooltip label="Редактировать" placement="top">
                                        <IconButton
                                            icon={<FiEdit2 />}
                                            size="sm"
                                            mr={2}
                                            onClick={() => onEdit(tx)}
                                            colorScheme="brand"
                                            variant="ghost"
                                        />
                                    </Tooltip>
                                    <Tooltip label="Удалить" placement="top">
                                        <IconButton
                                            icon={<FiTrash2 />}
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => handleDelete(tx._id)}
                                            variant="ghost"
                                        />
                                    </Tooltip>
                                </Td>
                            </Tr>
                        )) : (
                            <Tr>
                                <Td colSpan={6} textAlign="center" py={4}>
                                    Транзакции не найдены
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Мобильный вид */}
            <Box display={mobileDisplay}>
                <VStack spacing={4} align="stretch">
                    {txs.length > 0 ? txs.map(tx => (
                        <Box
                            key={tx._id}
                            p={4}
                            borderRadius="lg"
                            border="1px"
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                            _hover={{ boxShadow: 'md' }}
                            transition="all 0.2s"
                        >
                            <HStack justify="space-between" mb={2}>
                                <Text
                                    fontWeight="bold"
                                    color={tx.type === 'income' ? 'green.500' : 'red.500'}
                                >
                                    {tx.amount.toLocaleString()} ₸
                                </Text>
                                <Tag
                                    size="sm"
                                    colorScheme={tx.type === 'income' ? 'green' : 'red'}
                                    borderRadius="full"
                                >
                                    {tx.category}
                                </Tag>
                            </HStack>

                            <HStack justify="space-between" fontSize="sm" color="gray.500">
                                <Box>
                                    <Text>{tx.description || 'Нет описания'}</Text>
                                    <Text>{new Date(tx.date).toLocaleDateString()}</Text>
                                </Box>
                                <HStack spacing={2}>
                                    <IconButton
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        onClick={() => onEdit(tx)}
                                        colorScheme="brand"
                                        variant="ghost"
                                    />
                                    <IconButton
                                        icon={<FiTrash2 />}
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => handleDelete(tx._id)}
                                        variant="ghost"
                                    />
                                </HStack>
                            </HStack>
                        </Box>
                    )) : (
                        <Box textAlign="center" py={4}>
                            Транзакции не найдены
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}