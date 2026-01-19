import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Bot, Key, Swords } from 'lucide-react';
import { Link } from 'react-router';
import type { JSX } from 'react/jsx-runtime';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useUser from '@/store/user';
import { cn } from '@/lib/utils';

const AppSidebar = (): JSX.Element => {
  const { user } = useUser();

  return (
    <Sidebar className="motion-preset-slide-right-lg">
      <SidebarHeader className="p-3">
        <Link
          to={'/'}
          className="title-font text-3xl flex items-baseline justify-center gap-1 motion-preset-t"
        >
          Chess <span className="font-kalam">खेलो</span>{' '}
          <div className="text-xl opacity-65">.online</div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel slot="">Play</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/game/random" className={cn('text-xl gap-3')}>
                    <Swords className="size-6!" />
                    Play with random
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/game/bot" className="text-xl gap-3">
                    <Bot className="size-6!" />
                    Play with Bot
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {user.isLoggedIn ? (
          <Link
            to={'/account'}
            className="flex items-center gap-2 bg-accent p-2 rounded-md hover:opacity-90"
          >
            <Avatar>
              <AvatarImage
                src={user?.avatar || undefined}
                alt={user?.name || 'User'}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>{user?.name?.charAt(0) || 'CN'}</AvatarFallback>
            </Avatar>
            <div>
              <p>{user.name}</p>
              <p className="text-xs opacity-80">{user.email}</p>
            </div>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex gap-2 items-center bg-accent p-4 rounded-md hover:opacity-90"
          >
            <Key size={20} />
            Login
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
