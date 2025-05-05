// ThemeSelector.jsx
import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    HStack,
    Text,
    Icon,
    Box,
    useColorModeValue
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { FaSnowflake, FaLeaf, FaSun, FaCanadianMapleLeaf } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = () => {
    const { currentTheme, setCurrentTheme, themes } = useTheme();
    const bgColor = useColorModeValue('white', 'gray.700');

    // Иконки и названия для тем
    const themeOptions = [
        { id: 'default', name: 'Стандартная', icon: null },
        { id: 'winter', name: 'Зимняя', icon: FaSnowflake, color: 'blue.400' },
        { id: 'spring', name: 'Весенняя', icon: FaLeaf, color: 'green.400' },
        { id: 'summer', name: 'Летняя', icon: FaSun, color: 'orange.400' },
        { id: 'autumn', name: 'Осенняя', icon: FaCanadianMapleLeaf, color: 'red.400' }
    ];

    // Получаем текущую тему
    const currentThemeOption = themeOptions.find(option => option.id === currentTheme);

    return (
        <Box
            position="fixed"
            bottom="20px"
            right="20px"
            zIndex="1000"
            bg={bgColor}
            p={2}
            borderRadius="lg"
            boxShadow="md"
        >
            <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm" colorScheme="brand">
                    <HStack>
                        {currentThemeOption.icon && (
                            <Icon as={currentThemeOption.icon} color={currentThemeOption.color} />
                        )}
                        <Text>Тема: {currentThemeOption.name}</Text>
                    </HStack>
                </MenuButton>
                <MenuList>
                    {themeOptions.map((option) => (
                        <MenuItem
                            key={option.id}
                            onClick={() => setCurrentTheme(option.id)}
                            fontWeight={currentTheme === option.id ? "bold" : "normal"}
                        >
                            <HStack>
                                {option.icon && <Icon as={option.icon} color={option.color} />}
                                <Text>{option.name}</Text>
                            </HStack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default ThemeSelector;