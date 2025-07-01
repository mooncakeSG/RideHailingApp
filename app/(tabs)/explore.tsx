import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExploreScreen() {
  const menuItems = [
    {
      id: 'about',
      title: 'About the App',
      description: 'Learn about our ride-hailing service',
      icon: 'info-circle',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      iconColor: '#3B82F6'
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      description: 'Understand how to use the app',
      icon: 'question-circle',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100',
      iconColor: '#8B5CF6'
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick guide to get you started',
      icon: 'play-circle',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      iconColor: '#10B981'
    }
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Pressed menu item: ${itemId}`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#4338ca', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-16 pb-8"
      >
        <View className="items-center">
          <Text className="text-4xl font-black text-white text-center tracking-wide">
            Explore
          </Text>
          <View className="w-16 h-1 bg-white/30 rounded-full mt-3" />
          <Text className="text-white/80 text-center mt-2 text-lg">
            🚀 Discover amazing features
          </Text>
        </View>
      </LinearGradient>

      {/* Enhanced Menu Items */}
      <View className="px-6 py-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleMenuPress(item.id)}
            className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              {/* Enhanced Icon */}
              <LinearGradient
                colors={item.color.includes('blue') ? ['#3B82F6', '#06B6D4'] :
                       item.color.includes('purple') ? ['#8B5CF6', '#EC4899'] :
                       ['#10B981', '#059669']}
                className="w-16 h-16 rounded-xl items-center justify-center mr-6"
                style={{
                  shadowColor: item.iconColor,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                }}
              >
                <FontAwesome 
                  name={item.icon as any} 
                  size={24} 
                  color="white" 
                />
              </LinearGradient>

              {/* Enhanced Content */}
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {item.title}
                </Text>
                <Text className="text-gray-600 font-medium leading-5">
                  {item.description}
                </Text>
                
                {/* Progress indicator line */}
                <View className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full mt-3" />
              </View>

              {/* Enhanced Arrow */}
              <View className={`${item.bgColor} p-3 rounded-full ml-4`}>
                <FontAwesome 
                  name="chevron-right" 
                  size={18} 
                  color={item.iconColor}
                />
              </View>
            </View>

            {/* Enhanced Bottom Section */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600 font-medium">
                    {index === 0 ? '📱 Interactive guide' : 
                     index === 1 ? '🎯 Step-by-step tutorial' : 
                     '⚡ Quick setup'}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 font-semibold">
                  {index === 0 ? '2 min read' :
                   index === 1 ? '5 min read' :
                   '3 min read'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enhanced Bottom Section */}
      <View className="px-6 pb-8">
        <LinearGradient
          colors={['#f8fafc', '#ffffff']}
          className="rounded-2xl p-6 border border-gray-100"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900 mb-2" style={{
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              🎉 Need Help?
            </Text>
            <Text className="text-gray-600 text-center mb-4 font-medium">
              Our support team is here to assist you 24/7
            </Text>
            <TouchableOpacity className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-full">
              <Text className="text-white font-bold" style={{
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
                💬 Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
