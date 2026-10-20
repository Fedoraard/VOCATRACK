import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NodeBab, SkillStatus } from '../../utils/types';

interface SkillTreeNodeProps {
  node: NodeBab;
  onPress: (node: NodeBab) => void;
}

export const SkillTreeNode: React.FC<SkillTreeNodeProps> = React.memo(({ node, onPress }) => {
  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';

  const getNodeIcon = () => {
    if (isCompleted) return 'checkmark-circle';
    if (isActive) return 'play';
    return 'lock-closed';
  };

  const getStatusLabel = (status: SkillStatus) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'active':
        return 'Tersedia';
      case 'locked':
        return 'Terkunci';
    }
  };

  return (
    <View style={styles.outerWrapper}>
      <TouchableOpacity
        activeOpacity={isLocked ? 1 : 0.8}
        onPress={() => !isLocked && onPress(node)}
        style={[
          styles.nodeContainer,
          isCompleted && styles.completedNode,
          isActive && styles.activeNode,
          isLocked && styles.lockedNode,
        ]}
      >
        {/* Tier Indicator */}
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>T{node.tier}</Text>
        </View>

        {/* Center Icon */}
        <View
          style={[
            styles.iconCircle,
            isCompleted && styles.completedCircle,
            isActive && styles.activeCircle,
            isLocked && styles.lockedCircle,
          ]}
        >
          <Ionicons
            name={getNodeIcon()}
            size={22}
            color={isLocked ? '#94A3B8' : '#FFFFFF'}
          />
        </View>

        {/* Content */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                isLocked && styles.lockedText,
              ]}
              numberOfLines={1}
            >
              {node.title}
            </Text>
            <View
              style={[
                styles.statusTag,
                isCompleted && styles.completedTag,
                isActive && styles.activeTag,
                isLocked && styles.lockedTag,
              ]}
            >
              <Text
                style={[
                  styles.statusTagText,
                  isCompleted && styles.completedTagText,
                  isActive && styles.activeTagText,
                  isLocked && styles.lockedTagText,
                ]}
              >
                {getStatusLabel(node.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle} numberOfLines={1}>
            {node.subtitle}
          </Text>

          <View style={styles.rewardRow}>
            <Ionicons name="flash" size={12} color="#F59E0B" />
            <Text style={styles.xpText}>+{node.xpReward} XP</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

SkillTreeNode.displayName = 'SkillTreeNode';

const styles = StyleSheet.create({
  outerWrapper: {
    marginVertical: 8,
  },
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  completedNode: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
  },
  activeNode: {
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    backgroundColor: '#FAF5FF',
  },
  lockedNode: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },
  tierBadge: {
    position: 'absolute',
    top: -8,
    left: 14,
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  completedCircle: {
    backgroundColor: '#10B981',
  },
  activeCircle: {
    backgroundColor: '#4F46E5',
  },
  lockedCircle: {
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  lockedText: {
    color: '#64748B',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  completedTag: {
    backgroundColor: '#D1FAE5',
  },
  activeTag: {
    backgroundColor: '#EEF2FF',
  },
  lockedTag: {
    backgroundColor: '#F1F5F9',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  completedTagText: {
    color: '#059669',
  },
  activeTagText: {
    color: '#4F46E5',
  },
  lockedTagText: {
    color: '#94A3B8',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
});
