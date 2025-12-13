import { CreditCard, Globe, Shield, FileText, User, Mail, KeySquareIcon } from 'lucide-react';

export const NAV_LINKS = [
    {
        name: 'Bank accounts',
        path: '/dashboard/banks',
        subItems: [
            { id: 'designation', title: 'Bank Designation', count: 11, icon: CreditCard },
            { id: 'logs', title: 'Available Logs', count: 4, icon: FileText },
        ]
    },
    {
        name: 'Accounts',
        path: '/dashboard/accounts',
        subItems: [
            { id: 'social', title: 'Social Media', count: 79, icon: User },
            { id: 'streaming', title: 'Streaming', count: 4, icon: Globe },
            { id: 'Vpn', title: 'Vpn', count: 6, icon: KeySquareIcon },
            { id: 'fullz', title: 'No USA Fullz', count: 95, icon: FileText, highlight: true },
            { id: 'vcc', title: 'VCC', count: 17, icon: CreditCard },
            { id: 'email', title: 'E-Mails', count: 11362, icon: Mail },
        ]
    },
    {
        name: 'Full Info',
        path: '/dashboard/fullinfo',
        subItems: [
            { id: 'usa', title: 'USA Info', count: 450, icon: Shield },
            { id: 'uk', title: 'UK Info', count: 120, icon: Shield },
            { id: 'eu', title: 'Europe Info', count: 85, icon: Globe },
        ]
    },
    { name: 'Enroll', path: '/dashboard/enroll', subItems: [] },
    {
        name: 'Lookup Services',
        path: '/dashboard/lookup',
        subItems: [
            { id: 'user', title: 'User Search', count: 0, icon: User },
        ]
    },
    { name: 'Rules', path: '/dashboard/rules', subItems: [] },
    { name: 'FAQ', path: '/dashboard/faq', subItems: [] },
];