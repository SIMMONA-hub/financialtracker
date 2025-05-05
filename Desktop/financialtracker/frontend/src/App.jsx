// App.jsx
import { useState } from 'react';
import {
    Container,
    Heading,
    VStack,
    useColorModeValue,
    Box,
    Flex,
    Icon,
    Text,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { FiMenu, FiDollarSign, FiPieChart } from 'react-icons/fi';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
    const [refresh, setRefresh] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bgGradient = useColorModeValue(
        'linear(to-r, purple.100, blue.100)',
        'linear(to-r, purple.900, blue.900)'
    );

    const headerColor = useColorModeValue('brand.600', 'white');

    const triggerRefresh = () => {
        setRefresh(r => !r);
        setEditingTx(null);
    };

    return (
        <Box minH="100vh" bgGradient={bgGradient}>
            <IconButton
                icon={<FiMenu />}
                position="fixed"
                top="4"
                left="4"
                onClick={onOpen}
                colorScheme="brand"
                size="lg"
                zIndex="1000"
                borderRadius="full"
                boxShadow="lg"
            />

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        <Flex align="center">
                            <Icon as={FiDollarSign} mr={2} color="brand.500" />
                            <Text color="brand.500" fontWeight="bold">Финансовый Трекер</Text>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4} mt={4}>
                            <HStack>
                                <Icon as={FiDollarSign} color="brand.500" />
                                <Text>Транзакции</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FiPieChart} color="brand.500" />
                                <Text>Аналитика</Text>
                            </HStack>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Container maxW="container.lg" py={12}>
                <VStack spacing={8}>
                    <Box textAlign="center" w="full">
                        <Heading
                            as="h1"
                            size="xl"
                            color={headerColor}
                            fontWeight="extrabold"
                            letterSpacing="tight"
                            pb={2}
                        >
                            Финансовый Трекер
                        </Heading>
                        <Text color="gray.500">Управляйте своими финансами с легкостью</Text>
                    </Box>

                    <Tabs isFitted variant="soft-rounded" colorScheme="brand" w="full">
                        <TabList mb="1em">
                            <Tab fontWeight="medium" _selected={{ color: 'white', bg: 'brand.500' }}>Транзакции</Tab>
                            <Tab fontWeight="medium" _selected={{ color: 'white', bg: 'brand.500' }}>Аналитика</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <VStack spacing={8} align="stretch">
                                    <TransactionForm
                                        onSave={triggerRefresh}
                                        editingTx={editingTx}
                                        clearEditing={() => setEditingTx(null)}
                                    />
                                    <TransactionList
                                        key={String(refresh)}
                                        onEdit={tx => setEditingTx(tx)}
                                    />
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                <Dashboard />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </Container>
        </Box>
    );
}