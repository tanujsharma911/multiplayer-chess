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
import { Bot, FileCodeCorner, Swords, User } from 'lucide-react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router';
import type { JSX } from 'react/jsx-runtime';
import useUser from '@/store/user';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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
          <div className="text-xl opacity-65">.cloud</div>
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
        <SidebarGroup>
          <SidebarGroupLabel slot="">Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!user.isLoggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/login" className="text-xl gap-3">
                      <User className="size-6!" />
                      Login
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/docs" className="text-xl gap-3">
                    <FileCodeCorner className="size-5.5!" />
                    Documentation
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 flex space-x-4">
          <Link to="https://github.com/tanujsharma911/multiplayer-chess">
            <FaGithub
              className="opacity-60 hover:opacity-100 transition-opacity"
              size={22}
            />
          </Link>
          <Link to="https://linkedin.com/in/tanujsharma911">
            <FaLinkedinIn
              className="opacity-60 hover:opacity-100 transition-opacity"
              size={22}
            />
          </Link>
        </div>
        {user.isLoggedIn && (
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
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
