// components/TransactionForm.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, Select,
    HStack, Icon, VStack, useColorModeValue, InputGroup,
    InputLeftElement, Textarea
} from '@chakra-ui/react';
import { FiPlusCircle, FiSave, FiXCircle, FiDollarSign } from 'react-icons/fi';
import { API_URL } from '../api';

export default function TransactionForm({ onSave, editingTx, clearEditing }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const categories = {
        income: ['Зарплата', 'Инвестиции', 'Подарки', 'Прочие доходы'],
        expense: ['Продукты', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Образование', 'Прочие расходы']
    };

    useEffect(() => {
        if (editingTx) {
            setAmount(editingTx.amount);
            setCategory(editingTx.category);
            setType(editingTx.type);
            setDate(editingTx.date.slice(0,10));
            setDescription(editingTx.description);
        } else {
            // Set today's date as default when creating new transaction
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            setDate(`${year}-${month}-${day}`);
        }
    }, [editingTx]);

    const resetForm = () => {
        setAmount('');
        setCategory('');
        setType('expense');
        // Keep today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setDate(`${year}-${month}-${day}`);
        setDescription('');
        clearEditing();
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = { amount:+amount, category, type, date, description };
        const url = editingTx
            ? `${API_URL}/transactions/${editingTx._id}`
            : `${API_URL}/transactions`;
        const method = editingTx ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSave();
                resetForm();
            } else {
                console.error('Ошибка сохранения:', res.status);
                alert('Ошибка при сохранении');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка при сохранении');
        }
    };

    const bg = useColorModeValue('white', 'gray.800');
    const typeColorScheme = type === 'income' ? 'green' : 'red';

    return (
        <Box
            w="100%"
            p={6}
            bg={bg}
            boxShadow="xl"
            borderRadius="2xl"
            transition="all 0.3s"
            _hover={{ boxShadow: "2xl" }}
        >
            <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                    <HStack w="100%" spacing={4} align="flex-end">
                        <FormControl>
                            <FormLabel fontWeight="medium">Сумма</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Icon as={FiDollarSign} color="gray.500" />}
                                />
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                    borderRadius="lg"
                                    focusBorderColor="brand.400"
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel fontWeight="medium">Тип</FormLabel>
                            <Select
                                value={type}
                                onChange={e => {
                                    setType(e.target.value);
                                    setCategory(''); // Reset category when type changes
                                }}
                                borderRadius="lg"
                                focusBorderColor="brand.400"
                                bg={type === 'income' ? 'green.50' : 'red.50'}
                                _dark={{
                                    bg: type === 'income' ? 'green.900' : 'red.900',
                                    opacity: 0.8
                                }}
                            >
                                <option value="income">Доход</option>
                                <option value="expense">Расход</option>
                            </Select>
                        </FormControl>
                    </HStack>

                    <HStack w="100%" spacing={4}>
                        <FormControl>
                            <FormLabel fontWeight="medium">Категория</FormLabel>
                            <Select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Выберите категорию"
                                required
                                borderRadius="lg"
                                focusBorderColor="brand.400"
                            >
                                {categories[type].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="custom">Другое...</option>
                            </Select>
                            {category === 'custom' && (
                                <Input
                                    mt={2}
                                    placeholder="Введите свою категорию"
                                    onChange={e => setCategory(e.target.value)}
                                    borderRadius="lg"
                                    focusBorderColor="brand.400"
                                />
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel fontWeight="medium">Дата</FormLabel>
                            <Input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                                borderRadius="lg"
                                focusBorderColor="brand.400"
                            />
                        </FormControl>
                    </HStack>

                    <FormControl w="100%">
                        <FormLabel fontWeight="medium">Описание</FormLabel>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Добавьте детали транзакции..."
                            borderRadius="lg"
                            focusBorderColor="brand.400"
                            rows={2}
                        />
                    </FormControl>

                    <HStack pt={4} justifyContent="center" w="full">
                        <Button
                            leftIcon={<Icon as={editingTx ? FiSave : FiPlusCircle} />}
                            colorScheme={editingTx ? "brand" : typeColorScheme}
                            type="submit"
                            size="lg"
                            borderRadius="lg"
                            px={8}
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                        >
                            {editingTx ? 'Сохранить' : 'Добавить'}
                        </Button>
                        {editingTx && (
                            <Button
                                leftIcon={<FiXCircle />}
                                variant="outline"
                                onClick={resetForm}
                                size="lg"
                                borderRadius="lg"
                            >
                                Отменить
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}